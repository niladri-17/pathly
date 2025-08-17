import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { RequestMethod } from '@nestjs/common';
import { RequestAuthGuard } from './common/guards/request-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalGuards(app.get(RequestAuthGuard));

  app.setGlobalPrefix(':service/:module/:action', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  }); // setting up global route prefix for every request routes

  const appConfig = app.get(AppConfigService);

  await app.listen(appConfig.API_GATEWAY.PORT!);
  console.log(
    `API Gateway is running on http://${appConfig.API_GATEWAY.HOST}:${appConfig.API_GATEWAY.PORT}`,
  );
}

bootstrap().catch((e) => console.log(e));
