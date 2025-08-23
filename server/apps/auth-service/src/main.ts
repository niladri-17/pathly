import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  AsyncMicroserviceOptions,
  Transport,
  RpcException,
} from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('AUTH-SERVICE');

  try {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
      AppModule,
      {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE.HOST') || 'localhost',
            port: configService.get<number>('AUTH_SERVICE.PORT') || 3001,
          },
        }),
      },
    );

    const configService = app.get(ConfigService);

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

    const gracefulShutdown = async (signal: string) => {
      logger.log(`❌ Received ${signal}, shutting down gracefully`);
      try {
        await app.close();
        logger.log('❌ Auth Microservice closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('❌ Error during shutdown of Auth Microservice:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => {
      gracefulShutdown('SIGINT').catch((error) => {
        console.error(
          '❌ Error during graceful shutdown of Auth Microservice:',
          error,
        );
      });
    });
    process.on('SIGTERM', () => {
      gracefulShutdown('SIGTERM').catch((error) => {
        console.error(
          '❌ Error during graceful shutdown of Auth Microservice:',
          error,
        );
      });
    });

    await app.listen();
    logger.log(
      `🌐 Auth Service is running on http://${configService.get('AUTH_SERVICE.HOST')}:${configService.get('AUTH_SERVICE.PORT')}`,
    );
  } catch (error) {
    logger.error('❌ Failed to start microservice:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Unhandled error during bootstrap:', error);
  process.exit(1);
});
