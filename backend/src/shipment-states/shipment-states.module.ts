import { Module } from '@nestjs/common';
import { ShipmentStatesController } from './shipment-states.controller';
import { ShipmentStatesService } from './shipment-states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentStates } from './shipment-states.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentStates])],
  controllers: [ShipmentStatesController],
  providers: [ShipmentStatesService],
  exports: [ShipmentStatesService],
})
export class ShipmentStatesModule {}
