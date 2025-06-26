import { Module } from '@nestjs/common';
import { EmployeesVacationsController } from './employees-vacations.controller';
import { EmployeesVacationsService } from './employees-vacations.service';

@Module({
  controllers: [EmployeesVacationsController],
  providers: [EmployeesVacationsService]
})
export class EmployeesVacationsModule {}
