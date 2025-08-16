import { Module } from '@nestjs/common';
import { ServicesServiceController } from './services-service.controller';
import { ServicesServiceService } from './services-service.service';

@Module({
  imports: [],
  controllers: [ServicesServiceController],
  providers: [ServicesServiceService],
})
export class ServicesServiceModule {}
