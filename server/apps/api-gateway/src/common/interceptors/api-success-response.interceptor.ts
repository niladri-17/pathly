import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ApiSuccessResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();

        // If data already has the format, use appropriate status code
        if (data && typeof data === 'object' && 'statusCode' in data) {
          response.status(data.statusCode);
          return data;
        }

        // Default formatting
        return {
          success: true,
          statusCode: response.statusCode,
          message: 'Success',
          data: data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
