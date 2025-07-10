import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentTasks } from './current_tasks.entity';
import { CurrentTasksService } from './current_tasks.service';
import { CurrentTasksController } from './current_tasks.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { Stands } from 'src/stands/stands.entity';
import { EmployeesProfessionsModule } from 'src/employees_professions/employees_professions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurrentTasks,
      Employees,
      CurrentTaskStates,
      ShipmentsStands,
      StandTasks,
      Stands,
    ]),
    EmployeesModule,
    EmployeesProfessionsModule,
  ],
  providers: [CurrentTasksService],
  controllers: [CurrentTasksController],
  exports: [CurrentTasksService],
})
export class CurrentTasksModule {}
