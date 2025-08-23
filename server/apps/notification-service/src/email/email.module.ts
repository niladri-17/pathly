import { Module } from '@nestjs/common';
import { EmailConsumer } from './email.consumer';
import { MailModule } from '@app/channels';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MailModule,
    //! ClientsModule is only for setting up producers/publishers, not consumers.
    // ClientsModule.register([
    //   {
    //     name: 'EMAIL_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://admin:Admin@1234@localhost:5672/pathly'],
    //       queue: 'email_queue',
    //       queueOptions: { durable: true },
    //     },
    //   },
    // ]),
  ],
  controllers: [EmailConsumer],
})
export class EmailModule {}
