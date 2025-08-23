// rabbitmq.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as amqp from 'amqplib';

interface Exchange {
  name: string;
  type: 'topic' | 'direct' | 'fanout';
  options?: amqp.Options.AssertExchange;
  channel?: amqp.Channel; // Add channel property
}

interface Queue {
  name: string;
  routingKey: string;
  exchangeName: string;
  options?: amqp.Options.AssertQueue;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private channelMap: Map<string, amqp.Channel> = new Map();

  // Array of multiple exchanges with their dedicated channels
  private readonly exchanges: Exchange[] = [
    {
      name: 'notification_exchange',
      type: 'direct',
      options: { durable: true },
    },
    {
      name: 'logging_exchange',
      type: 'topic',
      options: { durable: true },
    },
    // Add more exchanges as needed
  ];

  private readonly queues: Queue[] = [
    {
      name: 'sms_queue',
      routingKey: 'sms',
      exchangeName: 'notification_exchange',
      options: { durable: true },
    },
    {
      name: 'email_queue',
      routingKey: 'email',
      exchangeName: 'notification_exchange',
      options: { durable: true },
    },
    {
      name: 'push_queue',
      routingKey: 'push',
      exchangeName: 'notification_exchange',
      options: { durable: true },
    },
    {
      name: 'log_queue',
      routingKey: 'log.*',
      exchangeName: 'logging_exchange',
      options: { durable: true },
    },
  ];

  constructor(private readonly connection: amqp.Connection) {}

  async onModuleInit() {
    try {
      // Create separate channels for each exchange
      for (const exchange of this.exchanges) {
        const channel = await this.connection.createChannel();

        // Store channel in map for easy access
        this.channelMap.set(exchange.name, channel);

        // Assert the exchange on its dedicated channel
        await channel.assertExchange(
          exchange.name,
          exchange.type,
          exchange.options,
        );

        this.logger.log(
          `🔗 Created dedicated channel for exchange: ${exchange.name}`,
        );
      }

      // Assert queues and bind them to their respective exchanges
      for (const queue of this.queues) {
        const channel = this.channelMap.get(queue.exchangeName);

        if (!channel) {
          throw new Error(
            `No channel found for exchange: ${queue.exchangeName}`,
          );
        }

        await channel.assertQueue(queue.name, queue.options);
        await channel.bindQueue(
          queue.name,
          queue.exchangeName,
          queue.routingKey,
        );

        this.logger.log(
          `📝 Bound queue ${queue.name} to exchange ${queue.exchangeName}`,
        );
      }

      this.logger.log(
        '🐇 RabbitMQService initialized: exchanges & queues ready with separate channels',
      );
    } catch (error) {
      this.logger.error('❌ Failed to initialize RabbitMQ service:', error);
      throw error;
    }
  }

  // Publish using the dedicated channel for the specified exchange
  async publish(
    exchangeName: string,
    routingKey: string,
    message: any,
  ): Promise<boolean> {
    const channel = this.channelMap.get(exchangeName);

    if (!channel) {
      throw new Error(`No channel found for exchange: ${exchangeName}`);
    }

    try {
      console.log('============================');
      return await channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }, // Make messages persistent
      );
    } catch (error) {
      this.logger.error(`❌ Failed to publish to ${exchangeName}:`, error);
      throw error;
    }
  }

  // Consume using the appropriate channel for the queue's exchange
  async consume(queueName: string, callback: (msg: any) => void) {
    // Find which exchange this queue belongs to
    const queue = this.queues.find((q) => q.name === queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found in configuration`);
    }

    const channel = this.channelMap.get(queue.exchangeName);
    if (!channel) {
      throw new Error(`No channel found for exchange: ${queue.exchangeName}`);
    }

    try {
      await channel.consume(queueName, (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
          } catch (error) {
            this.logger.error(
              `❌ Error processing message from ${queueName}:`,
              error,
            );
            channel.nack(msg, false, false); // Reject message
          }
        }
      });

      this.logger.log(`👂 Started consuming from queue: ${queueName}`);
    } catch (error) {
      this.logger.error(`❌ Failed to consume from ${queueName}:`, error);
      throw error;
    }
  }

  // Get channel for specific exchange (useful for advanced operations)
  getChannelForExchange(exchangeName: string): amqp.Channel | undefined {
    return this.channelMap.get(exchangeName);
  }

  // Get all available exchanges
  getExchanges(): string[] {
    return Array.from(this.channelMap.keys());
  }

  async onModuleDestroy() {
    this.logger.log('🔄 Closing RabbitMQ channels and connection...');

    // Close all channels
    for (const [exchangeName, channel] of this.channelMap.entries()) {
      try {
        await channel.close();
        this.logger.log(`✅ Closed channel for exchange: ${exchangeName}`);
      } catch (error) {
        this.logger.error(
          `❌ Error closing channel for ${exchangeName}:`,
          error,
        );
      }
    }

    // Close connection
    try {
      await this.connection.close();
      this.logger.log('✅ RabbitMQ connection closed successfully');
    } catch (error) {
      this.logger.error('❌ Error closing RabbitMQ connection:', error);
    }
  }
}
