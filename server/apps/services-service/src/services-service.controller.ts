import { Controller, Get } from '@nestjs/common';
import { ServicesServiceService } from './services-service.service';

@Controller()
export class ServicesServiceController {
  constructor(private readonly servicesServiceService: ServicesServiceService) {}

  @Get()
  getHello(): string {
    return this.servicesServiceService.getHello();
  }
}
