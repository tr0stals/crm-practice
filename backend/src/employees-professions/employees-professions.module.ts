import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesProfessions } from './employees-professions.entity';
import { EmployeesProfessionsService } from './employees-professions.service';
import { EmployeesProfessionsController } from './employees-professions.controller';
import { Employees } from 'src/employees/employees.entity';
import { Professions } from 'src/professions/professions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeesProfessions, Employees, Professions])],
  providers: [EmployeesProfessionsService],
  controllers: [EmployeesProfessionsController],
  exports: [EmployeesProfessionsService],
})
export class EmployeesProfessionsModule {}
