import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasks } from './current-tasks.entity';
import { CurrentTasksService } from './current-tasks.service';
import { CurrentTasksController } from './current-tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTasks])],
  providers: [CurrentTasksService],
  controllers: [CurrentTasksController],
  exports: [CurrentTasksService],
})
export class CurrentTasksModule {} 