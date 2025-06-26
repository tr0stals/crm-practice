import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandTasks } from './stand-tasks.entity';
import { StandTasksService } from './stand-tasks.service';
import { StandTasksController } from './stand-tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StandTasks])],
  providers: [StandTasksService],
  controllers: [StandTasksController],
  exports: [StandTasksService],
})
export class StandTasksModule {}
