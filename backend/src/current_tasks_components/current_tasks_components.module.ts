import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasksComponents } from './current_tasks_components.entity';
import { CurrentTasksComponentsService } from './current_tasks_components.service';
import { CurrentTasksComponentsController } from './current_tasks_components.controller';
import { ComponentsModule } from 'src/components/components.module';
import { CurrentTasksModule } from 'src/current_tasks/current_tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrentTasksComponents]),
    ComponentsModule,
    CurrentTasksModule,
  ],
  controllers: [CurrentTasksComponentsController],
  providers: [CurrentTasksComponentsService],
  exports: [CurrentTasksComponentsService],
})
export class CurrentTasksComponentsModule {}
