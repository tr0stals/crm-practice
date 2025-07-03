import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesVacations } from './employees_vacations.entity';
import { EmployeesVacationsService } from './employees_vacations.service';
import { EmployeesVacationsController } from './employees_vacations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeesVacations])],
  providers: [EmployeesVacationsService],
  controllers: [EmployeesVacationsController],
  exports: [EmployeesVacationsService],
})
export class EmployeesVacationsModule {}
