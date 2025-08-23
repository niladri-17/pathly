import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAILER } from './constants';
import { Mailer } from './interfaces/mailer.interface';
import { NodemailerMailerService } from './adapters/nodemailer-mailer.service';
import { SendgridMailerService } from './adapters/sendgrid-mailer.service';

export const MailProviders: Provider[] = [
  {
    provide: MAILER,
    useFactory: (configService: ConfigService): Mailer => {
      switch (configService.get<string>('MAIL_PROVIDER')) {
        case 'sendgrid':
          return new SendgridMailerService(configService);
        case 'nodemailer':
          return new NodemailerMailerService(configService);
        default:
          return new SendgridMailerService(configService);
      }
    },
    inject: [ConfigService], // 🔑 tells Nest to inject ConfigService
  },
];
