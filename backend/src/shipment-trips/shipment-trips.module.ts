import { Module } from '@nestjs/common';
import { ShipmentTripsController } from './shipment-trips.controller';
import { ShipmentTripsService } from './shipment-trips.service';

@Module({
  controllers: [ShipmentTripsController],
  providers: [ShipmentTripsService]
})
export class ShipmentTripsModule {}
