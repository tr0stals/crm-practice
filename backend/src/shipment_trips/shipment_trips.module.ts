import { Module } from '@nestjs/common';
import { ShipmentTripsController } from './shipment_trips.controller';
import { ShipmentTripsService } from './shipment_trips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentTrips } from './shipment_trips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentTrips])],
  controllers: [ShipmentTripsController],
  providers: [ShipmentTripsService],
  exports:[ShipmentTripsService]
})
export class ShipmentTripsModule {}
