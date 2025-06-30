import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasks } from './current-tasks.entity';
import { CurrentTasksService } from './current-tasks.service';
import { CurrentTasksController } from './current-tasks.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTaskStates } from 'src/current-task-states/current-task-states.entity';
import { ShipmentsStands } from 'src/shipments-stands/shipments-stands.entity';
import { StandTasks } from 'src/stand-tasks/stand-tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentTasks, Employees, CurrentTaskStates, ShipmentsStands, StandTasks]), EmployeesModule],
  providers: [CurrentTasksService],
  controllers: [CurrentTasksController],
  exports: [CurrentTasksService],
})
export class CurrentTasksModule {} 