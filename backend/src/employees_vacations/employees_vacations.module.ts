import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesVacations } from './employees_vacations.entity';
import { EmployeesVacationsService } from './employees_vacations.service';
import { EmployeesVacationsController } from './employees_vacations.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeesVacations]),
    OrganizationsModule,
    EmployeesModule,
  ],
  providers: [EmployeesVacationsService],
  controllers: [EmployeesVacationsController],
  exports: [EmployeesVacationsService],
})
export class EmployeesVacationsModule {}
