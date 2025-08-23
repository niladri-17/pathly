// // src/mail/sendgrid.service.ts
// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as sgMail from '@sendgrid/mail';
// import { SendGridMailOptions, SendGridResponse } from './interfaces/sendgrid.interface';

// @Injectable()
// export class SendGridService implements OnModuleInit {
//   private readonly logger = new Logger(SendGridService.name);

//   constructor(private readonly configService: ConfigService) {}

//   onModuleInit() {
//     const apiKey = this.configService.get<string>('sendgrid.apiKey');
//     if (!apiKey) {
//       throw new Error('SendGrid API key is required');
//     }

//     sgMail.setApiKey(apiKey);
//     this.logger.log('SendGrid service initialized');
//   }

//   async sendMail(options: SendGridMailOptions): Promise<SendGridResponse> {
//     try {
//       const defaultFrom = this.configService.get('sendgrid.defaultFrom');
//       const sandboxMode = this.configService.get('sendgrid.settings.sandboxMode');
//       const trackingSettings = this.configService.get('sendgrid.settings.trackingSettings');

//       const msg: sgMail.MailDataRequired = {
//         to: options.to,
//         from: options.from || defaultFrom,
//         subject: options.subject,
//         html: options.html,
//         text: options.text,
//         templateId: options.templateId,
//         dynamicTemplateData: options.dynamicTemplateData,
//         cc: options.cc,
//         bcc: options.bcc,
//         attachments: options.attachments,
//         categories: options.categories,
//         customArgs: options.customArgs,
//         mailSettings: {
//           sandboxMode: {
//             enable: sandboxMode,
//           },
//         },
//         trackingSettings,
//       };

//       const [response] = await sgMail.send(msg);

//       this.logger.log(`Email sent successfully via SendGrid to ${options.to}`);
//       this.logger.debug(`SendGrid response: ${response.statusCode}`);

//       return {
//         statusCode: response.statusCode,
//         body: response.body,
//         headers: response.headers,
//       };
//     } catch (error) {
//       this.logger.error(`SendGrid email failed: ${error.message}`, error.stack);

//       // Log SendGrid specific error details
//       if (error.response?.body?.errors) {
//         this.logger.error('SendGrid errors:', error.response.body.errors);
//       }

//       throw error;
//     }
//   }

//   async sendBulkMail(emails: SendGridMailOptions[]): Promise<SendGridResponse[]> {
//     const batchSize = this.configService.get('notification.batchSize');
//     const results: SendGridResponse[] = [];

//     for (let i = 0; i < emails.length; i += batchSize) {
//       const batch = emails.slice(i, i + batchSize);

//       const batchResults = await Promise.allSettled(
//         batch.map(email => this.sendMail(email))
//       );

//       batchResults.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           results.push(result.value);
//         } else {
//           this.logger.error(`Batch email ${i + index} failed:`, result.reason);
//           results.push({
//             statusCode: 500,
//             body: { error: result.reason.message },
//             headers: {},
//           });
//         }
//       });

//       // Add delay between batches to respect rate limits
//       if (i + batchSize < emails.length) {
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     }

//     return results;
//   }

//   async sendTemplateEmail(
//     to: string | string[],
//     templateId: string,
//     dynamicTemplateData: any,
//     options?: Partial<SendGridMailOptions>
//   ): Promise<SendGridResponse> {
//     return this.sendMail({
//       to,
//       templateId,
//       dynamicTemplateData,
//       categories: ['template-email'],
//       ...options,
//     });
//   }

//   async sendOtpEmail(
//     to: string,
//     otp: string,
//     expiryMinutes: number = 5
//   ): Promise<SendGridResponse> {
//     const templateId = this.configService.get('sendgrid.templates.otpVerification');

//     if (templateId) {
//       // Use SendGrid dynamic template
//       return this.sendTemplateEmail(to, templateId, {
//         otp,
//         expiryMinutes,
//         companyName: 'YourApp',
//       }, {
//         categories: ['otp', 'authentication'],
//         customArgs: {
//           type: 'otp',
//           expiryMinutes: expiryMinutes.toString(),
//         },
//       });
//     } else {
//       // Fallback to HTML email
//       return this.sendMail({
//         to,
//         subject: 'Your Verification Code',
//         html: this.generateOtpHtml(otp, expiryMinutes),
//         text: `Your verification code is: ${otp}. Valid for ${expiryMinutes} minutes.`,
//         categories: ['otp', 'authentication'],
//       });
//     }
//   }

//   private generateOtpHtml(otp: string, expiryMinutes: number): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Verification Code</title>
//           <style>
//               body {
//                   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//                   line-height: 1.6;
//                   color: #333;
//                   max-width: 600px;
//                   margin: 0 auto;
//                   padding: 20px;
//               }
//               .header {
//                   text-align: center;
//                   padding: 20px 0;
//                   border-bottom: 1px solid #eee;
//               }
//               .content {
//                   padding: 30px 0;
//               }
//               .code-block {
//                   background: #f8f9fa;
//                   border: 2px solid #007bff;
//                   border-radius: 8px;
//                   padding: 30px;
//                   text-align: center;
//                   margin: 30px 0;
//               }
//               .code {
//                   font-size: 36px;
//                   font-weight: bold;
//                   color: #007bff;
//                   letter-spacing: 4px;
//                   font-family: 'Courier New', monospace;
//               }
//               .footer {
//                   text-align: center;
//                   padding: 20px 0;
//                   border-top: 1px solid #eee;
//                   font-size: 12px;
//                   color: #666;
//               }
//               .warning {
//                   background: #fff3cd;
//                   border: 1px solid #ffeaa7;
//                   color: #856404;
//                   padding: 15px;
//                   border-radius: 5px;
//                   margin: 20px 0;
//               }
//           </style>
//       </head>
//       <body>
//           <div class="header">
//               <h1>YourApp</h1>
//           </div>
//           <div class="content">
//               <h2>Verification Code</h2>
//               <p>Hi there,</p>
//               <p>You requested a verification code. Here it is:</p>

//               <div class="code-block">
//                   <div class="code">${otp}</div>
//               </div>

//               <div class="warning">
//                   <strong>⏰ This code will expire in ${expiryMinutes} minutes.</strong>
//               </div>

//               <p>For your security:</p>
//               <ul>
//                   <li>Never share this code with anyone</li>
//                   <li>We will never ask for your code via phone or email</li>
//                   <li>If you didn't request this code, please ignore this email</li>
//               </ul>
//           </div>
//           <div class="footer">
//               <p>© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
//               <p>This is an automated message, please do not reply.</p>
//           </div>
//       </body>
//       </html>
//     `;
//   }

//   async validateApiKey(): Promise<boolean> {
//     try {
//       // Test API key by attempting to retrieve account information
//       await sgMail.send({
//         to: 'test@example.com',
//         from: this.configService.get('sendgrid.defaultFrom'),
//         subject: 'API Key Test',
//         text: 'Test',
//         mailSettings: {
//           sandboxMode: { enable: true }
//         }
//       });
//       return true;
//     } catch (error) {
//       this.logger.error('SendGrid API key validation failed:', error.message);
//       return false;
//     }
//   }
// }
