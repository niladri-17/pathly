import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import config from './config';
import { validate } from './config/env.validation';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/auth-service/.env`,
      load: [config],
      validate,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      onConnectionCreate: (connection: Connection) => {
        const logger = new Logger('MongoDB');

        connection.on('connected', () => {
          logger.log(
            `🍃  Database ${connection?.db?.databaseName} connected successfully`,
          );
          // logger.log(`Host: ${connection.host}:${connection.port}`);
        });

        connection.on('error', (error) => {
          logger.error('❌ MongoDB connection error:', error);
        });

        connection.on('disconnected', () => {
          logger.warn('⚠️  MongoDB disconnected');
        });

        return connection;
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
