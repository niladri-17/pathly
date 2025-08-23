import { ConfigService } from '@nestjs/config';
import { Mailer } from '../interfaces/mailer.interface';
import sgMail from '@sendgrid/mail';

export class SendgridMailerService implements Mailer {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID.API_KEY')!);
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    await sgMail.send({
      to: options.to,
      from: this.configService.get<string>('SENDGRID.FROM_EMAIL')!,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
