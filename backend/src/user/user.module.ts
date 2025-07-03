import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PeoplesModule } from 'src/peoples/peoples.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ProfessionsModule } from 'src/professions/professions.module';
import { Employees } from 'src/employees/employees.entity';
import { EmployeesProfessionsModule } from 'src/employees_professions/employees_professions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employees]),
    PeoplesModule,
    EmployeesModule,
    EmployeesProfessionsModule,
    ProfessionsModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
