import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandsController } from './stands.controller';
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { StandTypesModule } from 'src/stand_types/stand_types.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stands, User]),
    EmployeesModule,
    StandTypesModule,
    WebsocketModule,
  ],
  controllers: [StandsController],
  providers: [StandsService],
  exports: [StandsService],
})
export class StandsModule {}
