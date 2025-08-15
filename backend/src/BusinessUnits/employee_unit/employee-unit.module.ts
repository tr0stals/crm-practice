import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { EmployeeUnitService } from './employee-unit.service';
import { EmployeeUnitController } from './employee-unit.controller';
import { EmployeesProfessionsModule } from 'src/employees_professions/employees_professions.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { EmployeeDepartmentsModule } from 'src/employee_departments/employee_departments.module';
import { Employees } from 'src/employees/employees.entity';
import { EmployeeDepartments } from 'src/employee_departments/employee_departments.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Departments } from 'src/departments/departments.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';
import { DepartmentsModule } from 'src/departments/departments.module';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeesProfessions,
      Employees,
      EmployeeDepartments,
      Departments,
      ProfessionRights,
      Peoples,
    ]),
    EmployeesProfessionsModule,
    EmployeesModule,
    EmployeeDepartmentsModule,
    DatabaseModule,
    DepartmentsModule,
  ],
  providers: [EmployeeUnitService],
  controllers: [EmployeeUnitController],
  exports: [EmployeeUnitService],
})
export class EmployeeUnitModule {}
