import { Module } from '@nestjs/common';
import { CurrentTaskStatesController } from './current-task-states.controller';
import { CurrentTaskStatesService } from './current-task-states.service';

@Module({
  controllers: [CurrentTaskStatesController],
  providers: [CurrentTaskStatesService]
})
export class CurrentTaskStatesModule {}
