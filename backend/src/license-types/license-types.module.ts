import { Module } from '@nestjs/common';
import { LicenseTypesService } from './license-types.service';
import { LicenseTypesController } from './license-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseTypes } from './license-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseTypes])],
  providers: [LicenseTypesService],
  controllers: [LicenseTypesController],
  exports: [LicenseTypesService],
})
export class LicenseTypesModule {}
