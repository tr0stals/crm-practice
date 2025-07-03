import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasksComponents } from './current_tasks_components.entity';
import { CurrentTasksComponentsService } from './current_tasks_components.service';
import { CurrentTasksComponentsController } from './current_tasks_components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTasksComponents])],
  controllers: [CurrentTasksComponentsController],
  providers: [CurrentTasksComponentsService],
  exports: [TypeOrmModule],
})
export class CurrentTasksComponentsModule {} 