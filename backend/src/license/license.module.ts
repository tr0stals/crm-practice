import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';

@Module({
  providers: [LicenseService],
  controllers: [LicenseController]
})
export class LicenseModule {}
