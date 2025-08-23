// src/mail/interfaces/mailer.interface.ts
export interface Mailer {
  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): Promise<void>;
}
