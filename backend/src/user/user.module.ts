import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PeoplesModule } from 'src/peoples/peoples.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ProfessionsModule } from 'src/professions/professions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PeoplesModule,
    EmployeesModule,
    ProfessionsModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
