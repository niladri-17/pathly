import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  channel: 'sms' | 'email';
}
