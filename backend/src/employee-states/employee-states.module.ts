import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeStates } from './employee-states.entity';
import { EmployeeStatesService } from './employee-states.service';
import { EmployeeStatesController } from './employee-states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeStates])],
  providers: [EmployeeStatesService],
  controllers: [EmployeeStatesController],
  exports: [EmployeeStatesService],
})
export class EmployeeStatesModule {}
