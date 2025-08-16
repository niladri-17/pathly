import { Test, TestingModule } from '@nestjs/testing';
import { ServicesServiceController } from './services-service.controller';
import { ServicesServiceService } from './services-service.service';

describe('ServicesServiceController', () => {
  let servicesServiceController: ServicesServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServicesServiceController],
      providers: [ServicesServiceService],
    }).compile();

    servicesServiceController = app.get<ServicesServiceController>(ServicesServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(servicesServiceController.getHello()).toBe('Hello World!');
    });
  });
});
