import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTaskStates } from './current-task-states.entity';
import { CurrentTaskStatesService } from './current-task-states.service';
import { CurrentTaskStatesController } from './current-task-states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTaskStates])],
  providers: [CurrentTaskStatesService],
  controllers: [CurrentTaskStatesController],
  exports: [CurrentTaskStatesService],
})
export class CurrentTaskStatesModule {}
