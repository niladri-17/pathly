import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 6001 },
    },
  );

  // enable validation globally
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // strips properties not in the DTO
  //     forbidNonWhitelisted: true, // throws error if extra properties are passed
  //     transform: true, // transforms payloads to DTO instances
  //   }),
  // );

  // In your main.ts, customize the ValidationPipe exception factory
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new RpcException({
          statusCode: 400,
          error: 'Validation Error',
          message: errors.map((err) => ({
            field: err.property,
            errors: Object.values(err.constraints ?? {}),
          })),
        });
      },
    }),
  );

  await app.listen();
  logger.log('Auth Service running on TCP port 6001');
}
bootstrap();
