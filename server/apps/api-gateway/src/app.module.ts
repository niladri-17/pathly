import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { GatewayModule } from './gateway/gateway.module';
// import { RequestAuthGuard } from './common/guards/request-auth.guard';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/api-gateway/.env`,
    }),
    AppConfigModule, // ✅ import AppConfig module
    GatewayModule,
  ],
  // providers: [RequestAuthGuard],
})
export class AppModule {}
