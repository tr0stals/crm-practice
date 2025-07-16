import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandsController } from './stands.controller';
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { StandTypesModule } from 'src/stand_types/stand_types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stands]),
    EmployeesModule,
    StandTypesModule,
  ],
  controllers: [StandsController],
  providers: [StandsService],
  exports: [StandsService],
})
export class StandsModule {}
