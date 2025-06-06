import { Module } from '@nestjs/common';
import { ShipmentTripsController } from './shipment-trips.controller';
import { ShipmentTripsService } from './shipment-trips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentTrips } from './shipment-trips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentTrips])],
  controllers: [ShipmentTripsController],
  providers: [ShipmentTripsService],
  exports:[ShipmentTripsService]
})
export class ShipmentTripsModule {}
