import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/password-login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @MessagePattern('auth.login')
  async login(dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @MessagePattern('auth.send-otp')
  sendOtp(data: any) {
    return this.authService.sendOtp();
  }

  @MessagePattern('auth.verify-otp')
  verifyOtp(data: any) {
    return this.authService.verifyOtp();
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
