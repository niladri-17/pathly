import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/api-gateway/.env`,
    }),
    AppConfigModule, // ✅ import AppConfig module
    GatewayModule,
  ],
})
export class AppModule {}
