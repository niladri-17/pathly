import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
