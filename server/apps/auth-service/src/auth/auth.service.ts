import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from '@app/users/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/password-login.dto';
import { Types } from 'mongoose';
import { User, UserDocument } from '@app/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_TTL'),
      },
    );

    const refreshTokenTtl = rememberMe
      ? this.configService.get<string>('REFRESH_TOKEN_REMEMBER_ME_TTL')
      : this.configService.get<string>('REFRESH_TOKEN_DEFAULT_TTL');

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
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
