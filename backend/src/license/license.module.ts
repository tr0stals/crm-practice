import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './license.entity';
import { LicenseTypesModule } from 'src/license_types/license_types.module';
import { LicenseTypes } from 'src/license_types/license_types.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([License, LicenseTypes]),
    LicenseTypesModule,
  ],
  providers: [LicenseService],
  controllers: [LicenseController],
  exports: [LicenseService],
})
export class LicenseModule {}
