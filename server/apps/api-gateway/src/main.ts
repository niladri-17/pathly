import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { Logger, RequestMethod } from '@nestjs/common';
import { ApiSuccessResponseInterceptor } from './common/interceptors/api-success-response.interceptor';
import { ApiSuccessResponse } from '@app/common/types';
// import { RequestAuthGuard } from './common/guards/request-auth.guard';

async function bootstrap() {
  const logger = new Logger('API-GATEWAY');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalGuards(app.get(RequestAuthGuard));

  app.setGlobalPrefix(':service/:module', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  }); // setting up global route prefix for every request routes

  const appConfig = app.get(AppConfigService);

  app.useGlobalInterceptors(
    new ApiSuccessResponseInterceptor<ApiSuccessResponse>(),
  );

  await app.listen(appConfig.API_GATEWAY.PORT!);
  logger.log(
    `API Gateway is running on http://${appConfig.API_GATEWAY.HOST}:${appConfig.API_GATEWAY.PORT}`,
  );
}

bootstrap().catch((e) => console.log(e));
