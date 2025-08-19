import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';

// @Controller(':service/:module/:action') // did this global route prefix in the main file and excluded the heath route
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // ---- HEALTH CHECK ----
  @Get('health')
  public healthCheck() {
    return 'api-gateway';
  }

  // ---- GET ----
  @Get('')
  async handleGetNoId(
    @Param('service') service: string,
    @Param('module') module: string,
    // @Param('action') action: string,
  ) {
    return this.gatewayService.sendMessage(service, `${module}.findAll`, {});
  }

  @Get(':id')
  async handleGetWithId(
    @Param('service') service: string,
    @Param('module') module: string,
    // @Param('action') action: string,
    @Param('id') id: string,
  ) {
    return this.gatewayService.sendMessage(service, `${module}.findOne`, {
      id,
    });
  }

  // ---- POST ----
  @Post(':action')
  async handlePostNoId(
    @Param('service') service: string,
    @Param('module') module: string,
    @Param('action') action: string,
    @Body() body: any,
  ) {
    return this.gatewayService.sendMessage(
      service,
      `${module}.${action}`,
      body,
    );
  }

  // @Post(':action/:id')
  // async handlePostWithId(
  //   @Param('service') service: string,
  //   @Param('module') module: string,
  //   @Param('action') action: string,
  //   @Param('id') id: string,
  //   @Body() body: any,
  // ) {
  //   return this.gatewayService.sendMessage(service, `${module}.${action}`, {
  //     id,
  //     ...body,
  //   });
  // }

  // ---- PATCH ----
  @Patch(':action/:id')
  async handlePatch(
    @Param('service') service: string,
    @Param('module') module: string,
    @Param('action') action: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.gatewayService.sendMessage(service, `${module}.${action}`, {
      id,
      ...body,
    });
  }

  // ---- DELETE ----
  @Delete(':action/:id')
  async handleDelete(
    @Param('service') service: string,
    @Param('module') module: string,
    @Param('action') action: string,
    @Param('id') id: string,
  ) {
    return this.gatewayService.sendMessage(service, `${module}.${action}`, {
      id,
    });
  }
}
