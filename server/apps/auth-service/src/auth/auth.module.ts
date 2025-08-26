import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '@app/common/repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/common/schemas';
import { RedisModule } from '@app/redis';
import { RabbitMQModule } from '@app/brokers/rabbit-mq';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), // for working with multiple tokens we cant register the secret and expiry  here then it will be used for both access and refresh token. we will override and pass those during token generation
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // RabbitMQModule.register(QUEUES.OTP),
    RedisModule,
    RabbitMQModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
