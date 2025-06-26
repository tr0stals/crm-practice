import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesVacations } from './employees-vacations.entity';
import { EmployeesVacationsService } from './employees-vacations.service';
import { EmployeesVacationsController } from './employees-vacations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeesVacations])],
  providers: [EmployeesVacationsService],
  controllers: [EmployeesVacationsController],
  exports: [EmployeesVacationsService],
})
export class EmployeesVacationsModule {}
