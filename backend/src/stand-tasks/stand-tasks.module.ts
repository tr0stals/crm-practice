import { Module } from '@nestjs/common';
import { StandTasksController } from './stand-tasks.controller';
import { StandTasksService } from './stand-tasks.service';

@Module({
  controllers: [StandTasksController],
  providers: [StandTasksService]
})
export class StandTasksModule {}
