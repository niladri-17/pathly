import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from '@app/common/repositories';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/password-login.dto';
import { SendOtpDto } from './dtos/send-otp.dto';
import { MailService } from 'libs/channels/src';
import { User } from '@app/common/schemas';
import { createHmac, randomInt } from 'crypto';
import Redis from 'ioredis';
import { RedisService } from '@app/redis';
import { RabbitMQService } from '@app/brokers/rabbit-mq';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly redisService: RedisService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, firstName, lastName, rememberMe } = dto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Email is already registered',
      });
    }

    // password will be hashed in the pre-save hook
    const newUser = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      newUser._id.toString(),
      rememberMe,
    );

    // Optionally store the refresh token in the user document
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Prepare response
    const { password: _, ...safeUser } = newUser.toObject() as User;

    return {
      ...safeUser,
      accessToken,
      refreshToken,
    };
  }

  private generateAccessAndRefreshToken(
    userId: string,
    rememberMe: boolean,
  ): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN.SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN.TTL'),
      },
    );

    const refreshTokenTtl = rememberMe
      ? this.configService.get<string>('REFRESH_TOKEN.REMEMBER_ME_TTL')
      : this.configService.get<string>('REFRESH_TOKEN.DEFAULT_TTL');

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN.SECRET'),
        expiresIn: refreshTokenTtl,
      },
    );

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const { email, password, rememberMe } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password',
      });
    }

    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      user._id.toString(),
      rememberMe,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: {
        ...user.toObject(),
        accessToken,
        refreshToken,
      },
    };
  }

  async sendOtp(dto: SendOtpDto) {
    const { email } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    const otp = this.generateOtp(this.configService.get<number>('OTP_LENGTH')!);
    const html = this.otpEmailTemplate(otp);

    try {
      // await this.mailService.sendEmail(email, 'Your Login OTP', html);
      // await this.mailService.sendMail({
      //   to: email,
      //   subject: 'Your Login OTP',
      //   html,
      // });
      await this.redisService.setOTP(user._id.toString(), otp, 180);
      await this.rabbitMQService.publish('notification_exchange', 'email', {
        to: email,
        subject: 'Your Login OTP',
        html,
      });
      // Instead of sending the email here we will send the email to the notification-serivice which will use the mail module from the notifications folder from the libs and will queue the notification to the rabbitMQ which will store the otp in the redis cache.
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal Server Error';

      throw new RpcException({
        statusCode: 500,
        message,
      });
    }

    return {
      message: 'OTP sent successfully',
      data: {
        otp,
      },
    };
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

  async generateAndStoreOtp(userId: string): Promise<string> {
    const otpLength = this.configService.get<number>('OTP_LENGTH')!;
    // const ttl = this.configService.get<number>('OTP_TTL')!;

    // Generate random OTP
    const otp = this.generateOtp(otpLength);

    // Hash OTP for security
    const hashedOtp = this.hashOtp(otp, userId);

    // Store in Redis with TTL
    // const key = `otp:${userId}`;
    // await this.redis.setex(key, ttl, hashedOtp);

    // // Store attempt count
    // const attemptKey = `otp_attempts:${userId}`;
    // await this.redis.setex(attemptKey, ttl, '0');

    return otp; // Return plain OTP for sending
  }

  private generateOtp(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return randomInt(min, max).toString();
  }

  private hashOtp(otp: string, userId: string): string {
    const secret = this.configService.get<string>('JWT.SECRET')!;
    return createHmac('sha256', secret)
      .update(`${otp}:${userId}`)
      .digest('hex');
  }

  private otpEmailTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
        </head>
        <body style="background-color:#fff;margin:0;padding:0;">
          <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="background:#f4f4f4;">
            <tbody>
              <tr>
                <td>
                  <table align="center" width="100%" style="max-width:600px;background:#fff;border-radius:6px;overflow:hidden;">
                    <tr>
                      <td align="center" style="background:#5A3FFF;padding:20px;">
                        <!-- Inline SVG Logo -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" viewBox="0 0 24 24" width="40" height="40">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;text-align:center;font-family:sans-serif;">
                        <h1 style="margin-bottom:10px;font-size:22px;color:#333;">Login Verification</h1>
                        <p style="margin:0 0 20px;font-size:14px;color:#555;">
                          Use the following one-time password (OTP) to log in to your Pathly account.<br/>
                          This code will expire in 10 minutes.
                        </p>
                        <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#111;margin:20px 0;">
                          ${otp}
                        </div>
                        <p style="font-size:13px;color:#777;">(Do not share this code with anyone)</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top:1px solid #eee;padding:20px;text-align:center;font-size:12px;color:#888;">
                        Pathly will never ask you for your OTP, password, or sensitive information.<br/><br/>
                        © 2025 Pathly ·
                        <a href="https://yourpathlydomain.com/privacy" style="color:#5A3FFF;text-decoration:underline;">
                          Privacy Policy
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
  `;
  }
}
