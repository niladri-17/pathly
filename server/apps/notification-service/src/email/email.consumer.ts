import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailService } from '@app/channels';

@Controller()
export class EmailConsumer {
  constructor(private readonly mailService: MailService) {}

  @EventPattern() // no routing key needed, since queue already filters
  async handleEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('📩 Email Consumer received:', JSON.stringify(data));

    await this.mailService.sendMail(data);

    // acknowledge message
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
