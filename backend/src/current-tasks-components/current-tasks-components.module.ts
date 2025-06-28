import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasksComponents } from './current-tasks-components.entity';
import { CurrentTasksComponentsService } from './current-tasks-components.service';
import { CurrentTasksComponentsController } from './current-tasks-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTasksComponents])],
  controllers: [CurrentTasksComponentsController],
  providers: [CurrentTasksComponentsService],
  exports: [TypeOrmModule],
})
export class CurrentTasksComponentsModule {} 