import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandTasks } from './stand_tasks.entity';
import { StandTasksService } from './stand_tasks.service';
import { StandTasksController } from './stand_tasks.controller';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';
import { StandsModule } from 'src/stands/stands.module';
import { ComponentsModule } from 'src/components/components.module';
import { ProfessionsModule } from 'src/professions/professions.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { User } from 'src/user/user.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';
import { CurrentTaskStatesLogModule } from 'src/current_task_states_log/current_task_states_log.module';
import { CurrentTasksModule } from 'src/current_tasks/current_tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StandTasks,
      CurrentTasks,
      User,
      ProfessionRights,
    ]),
    StandsModule,
    ComponentsModule,
    ProfessionsModule,
    WebsocketModule,
    CurrentTaskStatesLogModule,
    CurrentTasksModule,
  ],
  providers: [StandTasksService],
  controllers: [StandTasksController],
  exports: [StandTasksService],
})
export class StandTasksModule {}
