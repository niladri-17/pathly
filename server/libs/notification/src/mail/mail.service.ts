import { Injectable, Logger } from '@nestjs/common';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendEmail(to: string, subject: string, html: string) {
    const msg: MailDataRequired = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: process.env.SENDGRID_FROM_NAME!,
      },
      subject,
      text: html.replace(/<[^>]*>/g, ''), // fallback plain text (strip HTML)
      html,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (error) {
      if (
        error?.code === 401 &&
        error?.response?.body?.errors?.[0]?.message ===
          'Maximum credits exceeded'
      ) {
        this.logger.error(
          'SendGrid credits exceeded. Please upgrade your plan or wait for credit reset.',
          error,
        );
      } else {
        this.logger.error('Failed to send email', error);
      }
      throw new Error(
        'Email service temporarily unavailable. Please try again later.',
      );
    }
  }
}
