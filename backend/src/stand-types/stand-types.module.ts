import { Module } from '@nestjs/common';
import { StandTypesController } from './stand-types.controller';
import { StandTypesService } from './stand-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandsTypes } from './stand-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandsTypes])],
  controllers: [StandTypesController],
  providers: [StandTypesService],
  exports: [StandTypesService]
})
export class StandTypesModule {}
