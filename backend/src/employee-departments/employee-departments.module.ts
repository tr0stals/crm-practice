import { Module } from '@nestjs/common';
import { EmployeeDepartmentsController } from './employee-departments.controller';
import { EmployeeDepartmentsService } from './employee-departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDepartments } from './employee-departments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeDepartments])],
  controllers: [EmployeeDepartmentsController],
  providers: [EmployeeDepartmentsService],
  exports: [EmployeeDepartmentsService],
})
export class EmployeeDepartmentsModule {}
