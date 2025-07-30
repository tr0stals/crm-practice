import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { CurrentTasksModule } from '../current_tasks/current_tasks.module';

@Module({
  imports: [CurrentTasksModule],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService],
})
export class DatabaseModule {}
