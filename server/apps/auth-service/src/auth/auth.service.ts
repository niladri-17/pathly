import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(data: any) {
    return 'register user';
  }

  login() {
    return 'login user';
  }

  sendOtp() {
    return 'send otp';
  }

  verifyOtp() {
    return 'verify otp';
  }

  refreshToken(data: any) {
    return 'refresh token';
  }

  forgotpassword(data: any) {
    // send reset password link to user's email
    return 'forgot password';
  }

  resetPassword(data: any) {
    // confirm new password in forgot password
    return 'reset password';
  }
}
