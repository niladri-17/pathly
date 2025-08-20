import { Injectable } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService {
  constructor(private readonly config: ConfigService) {}

  getClient(queue: string): ClientProxy {
    const url = this.config.get<string>('RABBITMQ_URL')!;
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
        queueOptions: { durable: true },
      },
    });
  }
}
