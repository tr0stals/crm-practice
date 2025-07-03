import { Module } from '@nestjs/common';
import { DatabaseLocalizationController } from './database_localization.controller';
import { DatabaseLocalizationService } from './database_localization.service';

@Module({
  controllers: [DatabaseLocalizationController],
  providers: [DatabaseLocalizationService],
  exports: [DatabaseLocalizationService],
})
export class DatabaseLocalizationModule {} 