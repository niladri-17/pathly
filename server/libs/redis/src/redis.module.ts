import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants';
import { RedisService } from './redis.service';

@Global() // makes this module's providers available app-wide (no need to import everywhere, just import once anywhere)
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('RedisModule');

        const redis = new Redis({
          host: configService.get('REDIS.HOST'),
          port: configService.get('REDIS.PORT'),
          password: configService.get('REDIS.PASSWORD'),

          maxRetriesPerRequest: 3, // retry each command up to 3 times before failing

          // controls how often to retry connection: increases by 50ms each attempt, capped at 2s
          retryStrategy: (times) => {
            if (times > 5) {
              // stop after 5 retries
              return null; // returning null stops reconnecting
            }
            const delay = Math.min(times * 50, 2000);
            logger.warn(
              `⚠️  Redis connection retry attempt ${times}, delay: ${delay}ms`,
            );
            return delay; // return null here to stop retrying
          },

          // automatically reconnect if Redis goes into READONLY mode (e.g., failover in cluster)
          reconnectOnError: (err) => {
            const targetError = 'READONLY';
            return err.message.includes(targetError);
          },
        });

        // event listeners for better visibility
        redis.on('connect', () => {
          logger.log('🛢️  Connected to Redis successfully');
        });

        redis.on('error', (error) => {
          logger.error('❌ Redis connection error:', error);
        });

        redis.on('ready', () => {
          logger.log('🛢️  Redis is ready to accept commands');
        });

        return redis; // makes the Redis instance available for injection
      },
      inject: [ConfigService], // inject ConfigService into factory
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService], // export the Redis client so other modules can use it
})
export class RedisModule {}
