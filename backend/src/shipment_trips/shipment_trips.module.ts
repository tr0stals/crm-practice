import { Module } from '@nestjs/common';
import { ShipmentTripsController } from './shipment_trips.controller';
import { ShipmentTripsService } from './shipment_trips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentTrips } from './shipment_trips.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentTrips]),
    EmployeesModule,
    ShipmentsModule,
  ],
  controllers: [ShipmentTripsController],
  providers: [ShipmentTripsService],
  exports: [ShipmentTripsService],
})
export class ShipmentTripsModule {}
