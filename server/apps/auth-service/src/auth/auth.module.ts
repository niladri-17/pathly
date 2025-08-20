import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '@app/notification';
import { UserRepository } from '@app/common/repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/common/schemas';
import { RabbitMQModule } from '@app/brokers/rabbit-mq';
import { QUEUES } from '@app/common/constants';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    MailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule.register(QUEUES.OTP),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
