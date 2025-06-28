import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandTasksComponents } from './stand-tasks-components.entity';
import { StandTasksComponentsService } from './stand-tasks-components.service';
import { StandTasksComponentsController } from './stand-tasks-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StandTasksComponents])],
  controllers: [StandTasksComponentsController],
  providers: [StandTasksComponentsService],
  exports: [TypeOrmModule],
})
export class StandTasksComponentsModule {} 