import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTaskStatesLogController } from './current_task_states_log.controller';
import { CurrentTaskStatesLogService } from './current_task_states_log.service';
import { CurrentTaskStatesLog } from './current_task_states_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTaskStatesLog])],
  controllers: [CurrentTaskStatesLogController],
  providers: [CurrentTaskStatesLogService],
  exports: [CurrentTaskStatesLogService],
})
export class CurrentTaskStatesLogModule {} 