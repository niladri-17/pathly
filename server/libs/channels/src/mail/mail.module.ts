import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProviders } from './mail.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailService, ...MailProviders],
  exports: [MailService],
})
export class MailModule {}
