import { Module } from '@nestjs/common';
import { EmployeeDepartmentsController } from './employee-departments.controller';
import { EmployeeDepartmentsService } from './employee-departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDepartments } from './employee-departments.entity';
import { Departments } from 'src/departments/departments.entity';
import { Employees } from 'src/employees/employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeDepartments, Departments, Employees])],
  controllers: [EmployeeDepartmentsController],
  providers: [EmployeeDepartmentsService],
  exports: [EmployeeDepartmentsService],
})
export class EmployeeDepartmentsModule {}
