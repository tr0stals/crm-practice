import { Module } from '@nestjs/common';
import { LicenseTypesService } from './license_types.service';
import { LicenseTypesController } from './license_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseTypes } from './license_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseTypes])],
  providers: [LicenseTypesService],
  controllers: [LicenseTypesController],
  exports: [LicenseTypesService],
})
export class LicenseTypesModule {}
