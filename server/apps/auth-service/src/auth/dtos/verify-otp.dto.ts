import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @Length(6, 6)
  otp: number;
}
