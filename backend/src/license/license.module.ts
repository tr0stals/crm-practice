import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './license.entity';
import { LicenseTypesModule } from 'src/license_types/license_types.module';
import { LicenseTypes } from 'src/license_types/license_types.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Shipments } from 'src/shipments/shipments.entity';
import { Stands } from 'src/stands/stands.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      License,
      LicenseTypes,
      Shipments,
      Stands,
      ShipmentsStands,
    ]),
    LicenseTypesModule,
    DatabaseModule,
  ],
  providers: [LicenseService],
  controllers: [LicenseController],
  exports: [LicenseService],
})
export class LicenseModule {}
