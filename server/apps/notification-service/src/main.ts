import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('NOTIFICATION-SERVICE');
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:Admin@1234@localhost:5672/pathly'],
      queue: 'email_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  logger.log('🚀 Notification Service running');
}

bootstrap();
