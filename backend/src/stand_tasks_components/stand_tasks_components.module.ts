import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandTasksComponents } from './stand_tasks_components.entity';
import { StandTasksComponentsService } from './stand_tasks_components.service';
import { StandTasksComponentsController } from './stand_tasks_components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StandTasksComponents])],
  controllers: [StandTasksComponentsController],
  providers: [StandTasksComponentsService],
  exports: [TypeOrmModule],
})
export class StandTasksComponentsModule {} 