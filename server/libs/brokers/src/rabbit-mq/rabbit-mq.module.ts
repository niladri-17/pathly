// rabbitmq.module.ts
import { Global, Module, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Module({
  providers: [
    {
      provide: RabbitMQService,
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RabbitMQModule');

        const host = configService.get<string>('RABBITMQ.HOST');
        const port = configService.get<number>('RABBITMQ.PORT');
        const vhost = configService.get<string>('RABBITMQ.VHOST');

        try {
          logger.log(
            `🐇 Attempting to connect to RabbitMQ at ${host}:${port}/${vhost}`,
          );

          // Create connection
          const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: configService.get<string>('RABBITMQ.HOST'),
            port: configService.get<number>('RABBITMQ.PORT'),
            username: configService.get<string>('RABBITMQ.USERNAME'),
            password: configService.get<string>('RABBITMQ.PASSWORD'),
            vhost: configService.get<string>('RABBITMQ.VHOST'),
            heartbeat: 60, // Add heartbeat for better connection monitoring
          });

          logger.log(
            `🐇 RabbitMQ connection established successfully to ${host}:${port}/${vhost}`,
          );

          // Set up connection event handlers
          connection.on('error', (error) => {
            logger.error('❌ RabbitMQ connection error:', error);
          });

          connection.on('close', () => {
            logger.warn('⚠️  RabbitMQ connection closed');
          });

          connection.on('blocked', (reason) => {
            logger.warn('⚠️  RabbitMQ connection blocked:', reason);
          });

          connection.on('unblocked', () => {
            logger.log('✅ RabbitMQ connection unblocked');
          });

          logger.log('🐇 RabbitMQ connection setup completed successfully');
          return new RabbitMQService(connection);
        } catch (error) {
          logger.error(
            `❌ Failed to connect to RabbitMQ at ${host}:${port}/${vhost}`,
            error?.stack,
          );
          throw error;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
