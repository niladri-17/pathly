import { RpcException } from '@nestjs/microservices';
import { ApiErrorResponse } from '../types';

export class RpcApiErrorException extends RpcException {
  constructor(statusCode: number, message: string, errors: any[] = []) {
    const timestamp = new Date().toISOString();
    const rpcError: ApiErrorResponse = {
      success: false,
      statusCode,
      message,
      errors,
      timestamp,
    };
    super(rpcError);
  }
}
