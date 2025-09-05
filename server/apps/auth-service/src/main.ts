import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcApiErrorException } from '@app/common/exceptions/rpc-api-error.exception';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
          throw new RpcApiErrorException(
            HttpStatus.BAD_REQUEST,
            'Validation failed',
            // test: errors,
            errors.map((err) => ({
              field: err.property,
              message: Object.values(err.constraints ?? {})[0],
            })),
          );
        },
      }),
    );

    // const config = new DocumentBuilder()
    //   .setTitle('Cats example')
    //   .setDescription('The cats API description')
    //   .setVersion('1.0')
    //   .addTag('cats')
    //   .build();

    // const documentFactory = () => SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, documentFactory);

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

    // Global exception filter
    // app.useGlobalFilters(new AllRpcExceptionsFilter());
    //! If i handle all exceptions here with the exception filter then the error will be converted to a normal response and in the api-gateway it will be seen as just a normal returned response data which will be returned and will not go into the catch block. so even if the response has a statusCode 500 in client it can show 200, 201

    // Global response transformer
    // app.useGlobalInterceptors(new ResponseTransformInterceptor());

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
