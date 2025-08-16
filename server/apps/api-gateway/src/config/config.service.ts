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
}
