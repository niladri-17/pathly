import { Inject, Injectable } from '@nestjs/common';
import { MAILER } from './constants';
import type { Mailer } from './interfaces/mailer.interface';

@Injectable()
export class MailService {
  constructor(@Inject(MAILER) private readonly mailer: Mailer) {}

  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }) {
    return this.mailer.sendMail(options);
  }
}
