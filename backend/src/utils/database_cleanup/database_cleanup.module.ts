import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseCleanupService } from './database_cleanup.service';
import { DatabaseCleanupController } from './database_cleanup.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [DatabaseCleanupController],
  providers: [DatabaseCleanupService],
  exports: [DatabaseCleanupService],
})
export class DatabaseCleanupModule {}