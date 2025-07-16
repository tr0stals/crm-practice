import { Module } from '@nestjs/common';
import { ShipmentPackageController } from './shipment_package.controller';
import { ShipmentPackageService } from './shipment_package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentPackage } from './shipment_package.entity';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { ShipmentPackageStatesModule } from 'src/shipment_package_states/shipment_package_states.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentPackage]),
    ShipmentsModule,
    ShipmentPackageStatesModule,
  ],
  controllers: [ShipmentPackageController],
  providers: [ShipmentPackageService],
  exports: [ShipmentPackageService],
})
export class ShipmentPackageModule {}
