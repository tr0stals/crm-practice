import { Module } from '@nestjs/common';
import { ShipmentPackageStatesController } from './shipment_package_states.controller';
import { ShipmentPackageStatesService } from './shipment_package_states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentPackageStates } from './shipment_package_states.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentPackageStates])],
  controllers: [ShipmentPackageStatesController],
  providers: [ShipmentPackageStatesService],
  exports: [ShipmentPackageStatesService],
})
export class ShipmentPackageStatesModule {}
