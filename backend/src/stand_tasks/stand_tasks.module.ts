import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandTasks } from './stand_tasks.entity';
import { StandTasksService } from './stand_tasks.service';
import { StandTasksController } from './stand_tasks.controller';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandTasks, CurrentTasks])],
  providers: [StandTasksService],
  controllers: [StandTasksController],
  exports: [StandTasksService],
})
export class StandTasksModule {}
