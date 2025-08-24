// src/common/interceptors/response-transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponseDto } from '../dtos/api-success-response.dto';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Skip transformation if data is already in ApiSuccessResponseDto format
        if (data instanceof ApiSuccessResponseDto) {
          return data;
        }

        return new ApiSuccessResponseDto<T>(
          'Request successful',
          data,
          response.statusCode || 200,
          request.url,
        );
      }),
    );
  }
}
