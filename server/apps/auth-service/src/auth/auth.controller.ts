import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  register(data: any) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.login')
  login(data: any) {
    return this.authService.login();
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
