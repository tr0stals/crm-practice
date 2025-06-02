import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './license.entity';

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  providers: [LicenseService],
  controllers: [LicenseController],
  exports: [LicenseService]
})
export class LicenseModule {}
