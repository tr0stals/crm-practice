import { Module } from '@nestjs/common';
import { EmployeeStatesController } from './employee-states.controller';
import { EmployeeStatesService } from './employee-states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeStates } from './employee-states.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeStates])],
  controllers: [EmployeeStatesController],
  providers: [EmployeeStatesService],
  exports: [EmployeeStatesService],
})
export class EmployeeStatesModule {}
