import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './config.service';

// @Global() // makes AppConfig available everywhere
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
