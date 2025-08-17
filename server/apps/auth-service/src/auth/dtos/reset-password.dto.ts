import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsNumber()
  @IsNotEmpty()
  password: number;
}
