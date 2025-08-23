import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // ============ Basic Key-Value Operations ============

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      this.logger.debug(`Set key: ${key} with TTL: ${ttl || 'none'}`);
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      const result = await this.redis.del(key);
      this.logger.debug(`Deleted key: ${key}, result: ${result}`);
      return result;
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      throw error;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      throw error;
    }
  }

  // ============ Pattern Operations ============

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}:`, error);
      throw error;
    }
  }

  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.redis.del(...keys);
      this.logger.debug(`Deleted ${result} keys matching pattern: ${pattern}`);
      return result;
    } catch (error) {
      this.logger.error(`Error deleting keys with pattern ${pattern}:`, error);
      throw error;
    }
  }

  // ============ Session Management ============

  async setSession(
    userId: string,
    sessionData: any,
    ttl: number = 3600,
  ): Promise<void> {
    const key = this.getSessionKey(userId);
    const session = {
      userId,
      data: sessionData,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
    };

    await this.set(key, session, ttl);
  }

  async getSession<T>(userId: string): Promise<T | null> {
    const key = this.getSessionKey(userId);
    return await this.get<T>(key);
  }

  async deleteSession(userId: string): Promise<void> {
    const key = this.getSessionKey(userId);
    await this.del(key);
  }

  async refreshSession(userId: string, ttl: number = 3600): Promise<boolean> {
    const key = this.getSessionKey(userId);
    const session = await this.get(key);

    if (!session) return false;

    await this.set(key, session, ttl);
    return true;
  }

  // ============ Caching Helpers ============

  async cache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.logger.debug(`Cache hit for key: ${key}`);
      return cached;
    }

    // If not in cache, fetch and store
    this.logger.debug(`Cache miss for key: ${key}, fetching...`);
    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  }

  async invalidateCache(pattern: string): Promise<void> {
    await this.deleteByPattern(pattern);
    this.logger.debug(`Invalidated cache for pattern: ${pattern}`);
  }

  // ============ Rate Limiting ============

  async rateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: Date;
  }> {
    const key = this.getRateLimitKey(identifier);
    const now = Date.now();
    const windowStart =
      Math.floor(now / (windowSeconds * 1000)) * (windowSeconds * 1000);

    try {
      const current = await this.redis.incr(key);

      if (current === 1) {
        await this.redis.expire(key, windowSeconds);
      }

      const remaining = Math.max(0, limit - current);
      const resetTime = new Date(windowStart + windowSeconds * 1000);

      return {
        allowed: current <= limit,
        remaining,
        resetTime,
      };
    } catch (error) {
      this.logger.error(`Error in rate limiting for ${identifier}:`, error);
      throw error;
    }
  }

  // ============ OTP Management ============

  async setOTP(
    identifier: string,
    otp: string,
    ttl: number = 300,
  ): Promise<void> {
    const key = this.getOTPKey(identifier);
    await this.set(key, { otp, createdAt: new Date().toISOString() }, ttl);
  }

  async verifyOTP(identifier: string, otp: string): Promise<boolean> {
    const key = this.getOTPKey(identifier);
    const stored = await this.get<{ otp: string; createdAt: string }>(key);

    if (!stored || stored.otp !== otp) {
      return false;
    }

    // Delete OTP after successful verification
    await this.del(key);
    return true;
  }

  async deleteOTP(identifier: string): Promise<void> {
    const key = this.getOTPKey(identifier);
    await this.del(key);
  }

  // ============ Pub/Sub Operations ============

  async publish(channel: string, message: any): Promise<void> {
    try {
      await this.redis.publish(channel, JSON.stringify(message));
      this.logger.debug(`Published message to channel: ${channel}`);
    } catch (error) {
      this.logger.error(`Error publishing to channel ${channel}:`, error);
      throw error;
    }
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void,
  ): Promise<void> {
    try {
      const subscriber = this.redis.duplicate();
      await subscriber.subscribe(channel);

      subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const parsedMessage = JSON.parse(message);
            callback(parsedMessage);
          } catch (error) {
            this.logger.error(`Error parsing message from ${channel}:`, error);
          }
        }
      });

      this.logger.log(`Subscribed to channel: ${channel}`);
    } catch (error) {
      this.logger.error(`Error subscribing to channel ${channel}:`, error);
      throw error;
    }
  }

  // ============ Hash Operations ============

  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      await this.redis.hset(key, field, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Error setting hash ${key}.${field}:`, error);
      throw error;
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting hash ${key}.${field}:`, error);
      throw error;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    try {
      const hash = await this.redis.hgetall(key);
      const result: Record<string, T> = {};

      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error getting all hash fields for ${key}:`, error);
      throw error;
    }
  }

  async hdel(key: string, field: string): Promise<number> {
    try {
      return await this.redis.hdel(key, field);
    } catch (error) {
      this.logger.error(`Error deleting hash field ${key}.${field}:`, error);
      throw error;
    }
  }

  // ============ List Operations ============

  async lpush(key: string, value: any): Promise<number> {
    try {
      return await this.redis.lpush(key, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Error pushing to list ${key}:`, error);
      throw error;
    }
  }

  async rpop<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.rpop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error popping from list ${key}:`, error);
      throw error;
    }
  }

  async llen(key: string): Promise<number> {
    try {
      return await this.redis.llen(key);
    } catch (error) {
      this.logger.error(`Error getting list length for ${key}:`, error);
      throw error;
    }
  }

  // ============ Health Check ============

  async ping(): Promise<string> {
    try {
      return await this.redis.ping();
    } catch (error) {
      this.logger.error('Redis ping failed:', error);
      throw error;
    }
  }

  async getInfo(): Promise<string> {
    try {
      return await this.redis.info();
    } catch (error) {
      this.logger.error('Error getting Redis info:', error);
      throw error;
    }
  }

  // ============ Private Helper Methods ============

  private getSessionKey(userId: string): string {
    return `session:${userId}`;
  }

  private getRateLimitKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  private getOTPKey(identifier: string): string {
    return `otp:${identifier}`;
  }
}
