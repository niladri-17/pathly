import { NestFactory } from '@nestjs/core';
import { ServicesServiceModule } from './services-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ServicesServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
