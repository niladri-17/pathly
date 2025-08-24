import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllRpcExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    console.log(ctx.getContext());
    console.log(ctx.getData());

    if (exception instanceof RpcException) {
      return exception.getError();
    }

    if (exception instanceof Error) {
      return {
        success: false,
        statusCode: 500,
        message: exception.message,
        errors: [],
        timestamp: new Date().toISOString(),
      };
    }

    // if it's some weird unknown value
    return {
      success: false,
      statusCode: 500,
      message: 'Unknown error',
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }
}
