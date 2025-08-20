import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {} // inject only

  public get API_GATEWAY() {
    return {
      HOST: this.configService.get<string>('API_GATEWAY_HOST'),
      PORT: this.configService.get<number>('API_GATEWAY_PORT'),
    };
  }

  public get AUTH_SERVICE() {
    return {
      HOST: this.configService.get<string>('AUTH_SERVICE_HOST'),
      PORT: this.configService.get<number>('AUTH_SERVICE_PORT'),
    };
  }

  public get USER_SERVICE() {
    return {
      HOST: this.configService.get<string>('USER_SERVICE_HOST'),
      PORT: this.configService.get<number>('USER_SERVICE_PORT'),
    };
  }

  public get SESSIONS_SERVICE() {
    return {
      HOST: this.configService.get<string>(
        'SESSIONS_SERVICE_HOST',
        'localhost',
      ),
      PORT: this.configService.get<number>('SESSIONS_SERVICE_PORT'),
    };
  }

  public get ACCESS_TOKEN() {
    return {
      SECRET: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      TTL: this.configService.get<string>('ACCESS_TOKEN_TTL'),
    };
  }

  public get REFRESH_TOKEN() {
    return {
      SECRET: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      DEFAULT_TTL: this.configService.get<string>('DEFAULT_TTL'),
      REMEMBER_ME_TTL: this.configService.get<string>('REMEMBER_ME_TTL'),
    };
  }
}
