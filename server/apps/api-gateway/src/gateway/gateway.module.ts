import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigModule } from '../config/config.module';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { JwtModule } from '@nestjs/jwt';
// @Module({
//   imports: [
//     ClientsModule.registerAsync([
//       {
//         name: 'AUTH_SERVICE',
//         imports: [AppConfigModule],
//         inject: [AppConfigService],
//         useFactory: (appConfig: AppConfigService) => ({
//           transport: Transport.TCP,
//           options: {
//             host: appConfig.AUTH_SERVICE.HOST,
//             port: appConfig.AUTH_SERVICE.PORT,
//           },
//         }),
//       },
//       {
//         name: 'USER_SERVICE',
//         imports: [AppConfigModule],
//         inject: [AppConfigService],
//         useFactory: (appConfig: AppConfigService) => ({
//           transport: Transport.TCP,
//           options: {
//             host: appConfig.USER_SERVICE.HOST,
//             port: appConfig.USER_SERVICE.PORT,
//           },
//         }),
//       },
//       {
//         name: 'SESSIONS_SERVICE',
//         imports: [AppConfigModule],
//         inject: [AppConfigService],
//         useFactory: (appConfig: AppConfigService) => ({
//           transport: Transport.TCP,
//           options: {
//             host: appConfig.SESSIONS_SERVICE.HOST,
//             port: appConfig.SESSIONS_SERVICE.PORT,
//           },
//         }),
//       },
//     ]),
//   ],
//   controllers: [GatewayController],
//   providers: [GatewayService],
//   exports: [ClientsModule], // so other modules can use these clients
// })
// export class GatewayModule {}

// ------------------------------------------------------
// 2nd way:

@Module({
  imports: [AppConfigModule, JwtModule.register({})],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
