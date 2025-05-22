import { Module } from '@nestjs/common';
import { LicenseTypesService } from './license-types.service';
import { LicenseTypesController } from './license-types.controller';

@Module({
  providers: [LicenseTypesService],
  controllers: [LicenseTypesController]
})
export class LicenseTypesModule {}
