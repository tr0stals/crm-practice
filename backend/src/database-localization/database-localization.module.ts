import { Module } from '@nestjs/common';
import { DatabaseLocalizationController } from './database-localization.controller';
import { DatabaseLocalizationService } from './database-localization.service';

@Module({
  controllers: [DatabaseLocalizationController],
  providers: [DatabaseLocalizationService],
  exports: [DatabaseLocalizationService],
})
export class DatabaseLocalizationModule {} 