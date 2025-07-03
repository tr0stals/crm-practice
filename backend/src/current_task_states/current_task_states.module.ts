import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTaskStates } from './current_task_states.entity';
import { CurrentTaskStatesService } from './current_task_states.service';
import { CurrentTaskStatesController } from './current_task_states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTaskStates])],
  providers: [CurrentTaskStatesService],
  controllers: [CurrentTaskStatesController],
  exports: [CurrentTaskStatesService],
})
export class CurrentTaskStatesModule {}
