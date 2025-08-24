import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/password-login.dto';
import { SendOtpDto } from './dtos/send-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(dto: RegisterDto) {
    console.log(dto);
    return await this.authService.register(dto);
  }

  @MessagePattern('auth.login')
  async login(dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @MessagePattern('auth.send-otp')
  sendOtp(dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @MessagePattern('auth.verify-otp')
  verifyOtp(dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @MessagePattern('auth.refresh-token')
  refreshToken(data: any) {
    return this.authService.refreshToken(data);
  }

  @MessagePattern('auth.forgot-password')
  forgotPassword(data: any) {
    return this.authService.forgotpassword(data);
  }

  @MessagePattern('auth.reset-password')
  resetPassword(data: any) {
    return this.authService.resetPassword(data);
  }
}
