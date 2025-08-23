// libs/shared/src/interfaces/notification.interface.ts
export interface EmailNotificationPayload {
  userId: string;
  otp: string;
  recipient: string;
  template: 'otp-verification';
  metadata?: {
    expiryTime?: number;
    attempts?: number;
  };
}

export interface NotificationQueuePayload {
  type: 'email' | 'sms';
  payload: EmailNotificationPayload;
  priority?: number;
  delay?: number;
}

// libs/shared/src/dto/notification.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, IsObject } from 'class-validator';

export class SendEmailNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  otp: string;

  @IsEmail()
  recipient: string;

  @IsEnum(['otp-verification'])
  template: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}
