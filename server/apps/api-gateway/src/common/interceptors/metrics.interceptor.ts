import {
  Inject,
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import { Observable, tap, catchError } from 'rxjs';

// Custom interceptor for HTTP metrics
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject('gateway_http_requests_total') private httpCounter: Counter<string>,
    @Inject('gateway_http_request_duration_seconds')
    private httpDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, params } = request;
    const { service, module: moduleParam, action } = params;

    const timer = this.httpDuration.startTimer({
      method,
      service: service || 'unknown',
      module: moduleParam || 'unknown',
      action: action || 'default',
    });

    return next.handle().pipe(
      tap(() => {
        timer();
        this.httpCounter.inc({
          method,
          service: service || 'unknown',
          module: moduleParam || 'unknown',
          action: action || 'default',
          status_code: '200',
        });
      }),
      catchError((error) => {
        timer();
        this.httpCounter.inc({
          method,
          service: service || 'unknown',
          module: moduleParam || 'unknown',
          action: action || 'default',
          status_code: error.status?.toString() || '500',
        });
        throw error;
      }),
    );
  }
}
