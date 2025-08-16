import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 6001 },
    },
  );

  await app.listen();
  console.log('Auth Service running on TCP port 6001');
}
