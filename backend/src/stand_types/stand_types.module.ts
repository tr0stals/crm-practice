import { Module } from '@nestjs/common';
import { StandTypesController } from './stand_types.controller';
import { StandTypesService } from './stand_types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandsTypes } from './stand_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandsTypes])],
  controllers: [StandTypesController],
  providers: [StandTypesService],
  exports: [StandTypesService]
})
export class StandTypesModule {}
