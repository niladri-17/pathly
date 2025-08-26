import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserRepository } from '@app/common/repositories';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { SendOtpDto } from './dtos/send-otp.dto';
import { User } from '@app/common/schemas';
import { createHmac, randomInt } from 'crypto';
import Redis from 'ioredis';
import { RedisService } from '@app/redis';
import { RabbitMQService } from '@app/brokers/rabbit-mq';
import { RpcApiErrorException } from '@app/common/exceptions/rpc-api-error.exception';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ApiCookie } from '@app/common/types';
import ms from 'ms';
import { plainToInstance } from 'class-transformer';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly redisService: RedisService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async register(dto: RegisterDto): Promise<{
    data: AuthResponseDto;
    cookies: ApiCookie[];
  }> {
    const { email, password, firstName, lastName, rememberMe } = dto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new RpcApiErrorException(
        HttpStatus.CONFLICT,
        'Email is already registered',
        [
          {
            field: 'email',
            message: 'Email is already registered',
          },
        ],
      );
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

    // store the refresh token in the user document
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Prepare response
    const user = newUser.toObject() as User;

    const refreshTokenTtl = rememberMe
      ? this.configService.get<string>('REFRESH_TOKEN.REMEMBER_ME_TTL')
      : this.configService.get<string>('REFRESH_TOKEN.DEFAULT_TTL');

    const cookies: ApiCookie[] = [
      {
        name: 'refreshToken',
        value: refreshToken,
        options: {
          httpOnly: true,
          secure: true,
          maxAge: ms(refreshTokenTtl),
          sameSite: 'lax',
          path: '/',
        },
      },
    ];

    return {
      data: plainToInstance(
        AuthResponseDto,
        {
          ...user,
          accessToken,
          refreshToken,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      cookies,
    };
  }

  private generateAccessAndRefreshToken(
    userId: string,
    rememberMe?: boolean,
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

  async login(
    dto: LoginDto,
  ): Promise<{ data: AuthResponseDto; cookies: ApiCookie[] }> {
    const { email, password, rememberMe } = dto;
    const userDoc = await this.userRepository.findByEmail(email);
    console.log(userDoc);
    if (!userDoc || !(await userDoc.comparePassword(password))) {
      throw new RpcApiErrorException(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password',
      );
    }

    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      userDoc._id.toString(),
      rememberMe,
    );

    // store the refresh token in the user document
    userDoc.refreshToken = refreshToken;
    await userDoc.save();

    const refreshTokenTtl = rememberMe
      ? this.configService.get<string>('REFRESH_TOKEN.REMEMBER_ME_TTL')
      : this.configService.get<string>('REFRESH_TOKEN.DEFAULT_TTL');

    const cookies: ApiCookie[] = [
      {
        name: 'refreshToken',
        value: refreshToken,
        options: {
          httpOnly: true,
          secure: true,
          maxAge: ms(refreshTokenTtl),
          sameSite: 'lax',
          path: '/',
        },
      },
    ];

    const user = userDoc.toObject() as User;

    return {
      data: plainToInstance(
        AuthResponseDto,
        {
          ...user,
          accessToken,
          refreshToken,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      cookies,
    };
  }

  async sendOtp(
    dto: SendOtpDto,
  ): Promise<{ expiresIn: number; resendIn: number }> {
    const { email } = dto;

    // 1. Validate user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new RpcApiErrorException(HttpStatus.NOT_FOUND, 'User not found', [
        {
          field: 'email',
          message: 'User not found',
        },
      ]);
    }

    const userId = user._id.toString();
    const otpKey = `otp:email:login:${userId}`;

    // 2. Check for existing OTP
    const existingOtp = await this.redisService.get<string>(otpKey);
    if (existingOtp) {
      throw new RpcApiErrorException(
        HttpStatus.TOO_MANY_REQUESTS,
        'OTP already sent. Please wait before requesting a new one.',
        [
          {
            field: 'otp',
            message: 'Please wait before requesting a new OTP',
          },
        ],
      );
    }

    // 3. Generate OTP and email content
    const otpLength = this.configService.get<number>('OTP_LENGTH') || 6;
    const otp = this.generateOtp(otpLength);
    const html = this.otpEmailTemplate(otp);
    const otpExpiryTime = 180; // 3 minutes

    try {
      // 4. Store OTP and send email concurrently
      await Promise.all([
        this.redisService.set(otpKey, otp, otpExpiryTime),
        this.rabbitMQService.publish('notification_exchange', 'email', {
          to: email,
          subject: 'Your Login OTP',
          html,
        }),
      ]);

      return {
        expiresIn: otpExpiryTime,
        resendIn: 60,
      };
    } catch (error: unknown) {
      // 5. Clean up on failure
      await this.redisService.del(otpKey).catch(() => {
        // Ignore cleanup errors
      });

      this.logger.error('OTP sending failed:', { email, error });

      throw new RpcApiErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to send OTP. Please try again.',
      );
    }
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ data: AuthResponseDto; cookies: ApiCookie[] }> {
    const { email, otp } = dto;
    const userDoc = await this.userRepository.findByEmail(email);
    if (!userDoc) {
      throw new RpcApiErrorException(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password',
      );
    }

    if (
      otp !==
      (await this.redisService.get<string>(
        `otp:email:login:${userDoc._id.toString()}`,
      ))
    )
      throw new RpcApiErrorException(HttpStatus.UNAUTHORIZED, 'Invalid OTP', [
        { field: 'otp', message: 'Invalid OTP' },
      ]);

    const { accessToken, refreshToken } = this.generateAccessAndRefreshToken(
      userDoc._id.toString(),
    );

    await this.redisService.del(`otp:email:login:${userDoc._id.toString()}`);

    const refreshTokenTtl = this.configService.get<string>(
      'REFRESH_TOKEN.DEFAULT_TTL',
    );
    // rememberMe
    // ? this.configService.get<string>('REFRESH_TOKEN.REMEMBER_ME_TTL')
    // :

    const cookies: ApiCookie[] = [
      {
        name: 'refreshToken',
        value: refreshToken,
        options: {
          httpOnly: true,
          secure: true,
          maxAge: ms(refreshTokenTtl),
          sameSite: 'lax',
          path: '/',
        },
      },
    ];

    const user = userDoc.toObject() as User;

    return {
      data: plainToInstance(
        AuthResponseDto,
        {
          ...user,
          accessToken,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      cookies,
    };
  }

  async refreshToken(data: {
    cookies: { refreshToken: string };
  }): Promise<{ accessToken: string }> {
    const refreshToken = data?.cookies?.refreshToken;
    if (!refreshToken) {
      throw new RpcApiErrorException(HttpStatus.UNAUTHORIZED, 'Missing token');
    }

    let user: JwtPayload;

    try {
      user = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN.SECRET'),
      });
    } catch (error) {
      console.error('Failed to verify refresh token:', error);
      throw new RpcApiErrorException(
        HttpStatus.UNAUTHORIZED,
        'Invalid refresh token',
      );
    }

    // // Validate user exists
    const userDoc = await this.userRepository.findById(user.sub as string);
    if (!userDoc) {
      console.error('User not found');
      throw new RpcApiErrorException(
        HttpStatus.UNAUTHORIZED,
        'Invalid refresh token',
      );
    }

    if (userDoc.refreshToken !== refreshToken) {
      console.error('Refresh token does not match');
      throw new RpcApiErrorException(
        HttpStatus.UNAUTHORIZED,
        'Invalid refresh token',
      );
    }

    const { accessToken } = this.generateAccessAndRefreshToken(
      userDoc._id.toString(),
    );

    return { accessToken };
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
