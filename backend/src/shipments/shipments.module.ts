import { Module } from '@nestjs/common';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { LicenseModule } from 'src/license/license.module';
import { Stands } from 'src/stands/stands.entity';
import { ShipmentPackage } from 'src/shipment_package/shipment_package.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipments,
      Stands,
      ShipmentPackage,
      ShipmentsStands,
    ]),
    OrganizationsModule,
    LicenseModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
