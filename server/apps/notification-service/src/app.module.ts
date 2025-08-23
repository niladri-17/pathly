import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/auth-service/.env`,
      load: [config],
      validate,
    }),
    EmailModule,
  ],
})
export class AppModule {}
