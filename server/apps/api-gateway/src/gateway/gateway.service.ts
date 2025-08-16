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

import { Injectable, HttpException } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AppConfigService } from '../config/config.service';

interface MicroserviceConfig {
  host: string;
  port: number;
}

@Injectable()
export class GatewayService {
  private readonly serviceRegistry: Record<string, MicroserviceConfig> = {};
  private readonly clients: Record<string, ClientProxy> = {};

  constructor(private readonly appConfig: AppConfigService) {
    // Initialize service registry dynamically
    this.serviceRegistry = {
      auth: {
        host: this.appConfig.AUTH_SERVICE.HOST!,
        port: this.appConfig.AUTH_SERVICE.PORT!,
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
  async sendMessage<T = any>(
    service: string,
    pattern: string,
    data: unknown,
  ): Promise<T> {
    const client = this.clients[service];
    if (!client) throw new HttpException(`Service ${service} not found`, 404);
    console.log(pattern);
    try {
      const observable = client.send<T>(pattern, data); // typed observable
      return await lastValueFrom(observable); // returns Promise<T>
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, 500);
      }
      console.log(error);
      throw new HttpException('Service error', 500);
    }
  }
}
