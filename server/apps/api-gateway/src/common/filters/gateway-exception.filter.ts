import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class GatewayExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.headers['x-request-id'] || this.generateRequestId();

    let status: number;
    let message: string;
    let error: string;
    let details: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = (errorResponse as any).message || exception.message;
        error = (errorResponse as any).error || exception.name;
        details = (errorResponse as any).details || [];
      } else {
        message = errorResponse as string;
        error = exception.name;
      }
    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError() as any;
      status = rpcError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      message = rpcError.message || 'Microservice error';
      error = rpcError.error || 'RpcError';
    } else {
      // Handle microservice connection errors
      if ((exception as any).code === 'ECONNREFUSED') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Service temporarily unavailable';
        error = 'ServiceUnavailable';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        error = 'InternalServerError';
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      ...(details.length > 0 && { errors: details }),
    };

    response.status(status).json(errorResponse);
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
