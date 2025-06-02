import { Module } from '@nestjs/common';
import { StandTypesController } from './stand-types.controller';

@Module({
  controllers: [StandTypesController]
})
export class StandTypesModule {}
