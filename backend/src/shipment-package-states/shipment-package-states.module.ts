import { Module } from '@nestjs/common';
import { ShipmentPackageStatesController } from './shipment-package-states.controller';
import { ShipmentPackageStatesService } from './shipment-package-states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentPackageStates } from './shipment-package-states.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentPackageStates])],
  controllers: [ShipmentPackageStatesController],
  providers: [ShipmentPackageStatesService],
  exports: [ShipmentPackageStatesService],
})
export class ShipmentPackageStatesModule {}
