import { forwardRef, Module } from '@nestjs/common';
import { CurrentTasksBusinessService } from './current-tasks-business.service';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { ShipmentsStandsModule } from 'src/shipments_stands/shipments_stands.module';
import { CurrentTaskStatesModule } from 'src/current_task_states/current_task_states.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { StandTasksModule } from 'src/stand_tasks/stand_tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrentTasks]),
    forwardRef(() => ShipmentsModule),
    forwardRef(() => ShipmentsStandsModule),
    CurrentTaskStatesModule,
    StandTasksModule,
  ],
  providers: [CurrentTasksBusinessService],
  exports: [CurrentTasksBusinessService],
})
export class CurrentTasksBusinessModule {}
