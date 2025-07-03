import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employees } from './employees.entity';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';
import { User } from 'src/user/user.entity';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { EmployeeDepartmentsModule } from 'src/employee_departments/employee_departments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employees,
      Peoples,
      Professions,
      User,
      EmployeesProfessions,
    ]),
    EmployeeDepartmentsModule
  ],
  providers: [EmployeesService],
  controllers: [EmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
