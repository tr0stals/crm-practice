import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeTasks } from './employee-tasks.entity';
import { EmployeeTasksService } from './employee-tasks.service';
import { EmployeeTasksController } from './employee-tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeTasks])],
  providers: [EmployeeTasksService],
  controllers: [EmployeeTasksController],
  exports: [EmployeeTasksService],
})
export class EmployeeTasksModule {} 