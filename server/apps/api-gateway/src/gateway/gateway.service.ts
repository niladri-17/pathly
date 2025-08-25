// 1st way :
// import { Injectable, Inject } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';

// @Injectable()
// export class GatewayService {
//   constructor(
//     @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
//     @Inject('SESSIONS_SERVICE') private readonly sessionsClient: ClientProxy,
//   ) {}

//   async sendMessage<T>(
//     service: string,
//     pattern: string,
//     data: any,
//   ): Promise<T> {
//     let client: ClientProxy;
//     if (service === 'users') client = this.authClient;
//     else if (service === 'sessions') client = this.sessionsClient;
//     else throw new Error('Service not found');

//     const observable = client.send<T>(pattern, data);
//     return lastValueFrom(observable); // Converts Observable to Promise
//   }
// }

// ---------------------------------------------------------

// 2nd way:

import {
  Injectable,
  Inject,
  Scope,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Logger,
  HttpException,
  ServiceUnavailableException,
  HttpStatus,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AppConfigService } from '../config/config.service';
import { ApiSuccessResponse, JwtPayload } from '@app/common/types';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

interface MicroserviceConfig {
  host: string;
  port: number;
}

@Injectable({ scope: Scope.REQUEST }) // ⚠️ important
export class GatewayService {
  private readonly serviceRegistry: Record<string, MicroserviceConfig> = {};
  private readonly clients: Record<string, ClientProxy> = {};
  private readonly logger: Logger = new Logger(GatewayService.name);

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    // Initialize service registry dynamically
    this.serviceRegistry = {
      auth: {
        host: this.appConfig.AUTH_SERVICE.HOST!,
        port: this.appConfig.AUTH_SERVICE.PORT!,
      },
      users: {
        host: this.appConfig.USER_SERVICE.HOST!,
        port: this.appConfig.USER_SERVICE.PORT!,
      },
      // add more services here if needed
    };

    // Create ClientProxy instances dynamically
    this.registerServices(this.serviceRegistry);
  }

  private registerServices(
    serviceRegistry: Record<string, MicroserviceConfig>,
  ) {
    for (const [name, config] of Object.entries(serviceRegistry)) {
      this.clients[name] = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: config.host, port: config.port },
      });
    }
  }

  // Generic type T for safe return typing
  async sendMessage<T extends ApiSuccessResponse = ApiSuccessResponse>(
    service: string,
    pattern: string,
    payload: Record<string, any>,
  ): Promise<T> {
    // Step 0: Check if service exists
    const client = this.clients[service];
    if (!client) throw new NotFoundException(`Service ${service} not found`);

    // Step 1: Skip auth for auth service
    if (service !== 'auth') {
      const authHeader = this.request.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or malformed token');
      }

      const token = authHeader.split(' ')[1];

      let user: JwtPayload;
      try {
        user = await this.jwtService.verifyAsync<JwtPayload>(token, {
          secret: this.appConfig.ACCESS_TOKEN.SECRET!,
        });
      } catch (error) {
        if (
          error instanceof TokenExpiredError
          //  ||
          // error?.name === 'TokenExpiredError'
        ) {
          throw new UnauthorizedException('Token expired');
        }
        throw new UnauthorizedException('Invalid token');
      }

      payload = { payload, user };
    }

    // Step 2: Send message
    try {
      const observable = client.send<T>(pattern, payload);
      const result = await lastValueFrom<T>(observable);
      if (result.cookies && Array.isArray(result.cookies)) {
        result.cookies.forEach((cookie) => {
          this.request.res?.cookie(
            cookie.name,
            cookie.value,
            cookie.options || {},
          );
        });
      }

      return result;

      // return this.request.res.status(result.statusCode).json(result);
      // //! this will create circular reference since nestjs itselt will also try to send the response and here were tryto send the response through express
      //* so we are modifiying the response in the global interceptor
    } catch (error: unknown) {
      this.logger.error(error);

      // 🟢 Case 1: No message handler found in remote service
      if (
        typeof error === 'string' &&
        error.includes('no matching message handler')
      ) {
        const httpError = {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
          errors: [],
          timestamp: new Date().toISOString(),
        };
        throw new NotFoundException(httpError);
      }

      // 🟢 Case 2: RpcException with { statusCode }
      if (error?.statusCode && typeof error?.statusCode === 'number') {
        throw new HttpException(error, error.statusCode);
      }

      // 🟢 Case 3: Nest default serialized error (status = "error")
      if (error?.status === 'error') {
        const httpError = {
          success: false,
          statusCode: 500,
          message: error?.message || 'Unknown error',
          errors: [],
          timestamp: new Date().toISOString(),
        };

        throw new InternalServerErrorException(httpError);
      }

      // 🟢 Case 4: Connection error
      if (error?.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException({
          success: false,
          message: 'Service unavailable',
          errors: [],
          statusCode: 503,
          timestamp: new Date().toISOString(),
        });
      }

      // 🟢 Fallback
      throw new InternalServerErrorException(
        'Unexpected error from the downstream service',
      );
    }
  }
}
