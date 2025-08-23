import { ConfigService } from '@nestjs/config';
import { Mailer } from '../interfaces/mailer.interface';
import * as nodemailer from 'nodemailer';

export class NodemailerMailerService implements Mailer {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL.USER'),
        pass: this.configService.get<string>('MAIL.PASS'),
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }) {
    await this.transporter.sendMail({
      from: options.from || this.configService.get<string>('MAIL.FROM'),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
