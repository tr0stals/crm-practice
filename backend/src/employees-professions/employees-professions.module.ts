import { Module } from '@nestjs/common';
import { EmployeesProfessionsController } from './employees-professions.controller';
import { EmployeesProfessionsService } from './employees-professions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employees } from 'src/employees/employees.entity';
import { Professions } from 'src/professions/professions.entity';
import { EmployeesProfessions } from './employees-professions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeesProfessions, Employees, Professions]),
  ],
  controllers: [EmployeesProfessionsController],
  providers: [EmployeesProfessionsService],
  exports: [EmployeesProfessionsService],
})
export class EmployeesProfessionsModule {}
