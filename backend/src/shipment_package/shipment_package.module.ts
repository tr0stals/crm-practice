import { Module } from '@nestjs/common';
import { ShipmentPackageController } from './shipment_package.controller';
import { ShipmentPackageService } from './shipment_package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentPackage } from './shipment_package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentPackage])],
  controllers: [ShipmentPackageController],
  providers: [ShipmentPackageService],
  exports: [ShipmentPackageService],
})
export class ShipmentPackageModule {}
