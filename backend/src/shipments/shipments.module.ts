import { Module } from '@nestjs/common';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { LicenseModule } from 'src/license/license.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipments]),
    OrganizationsModule,
    LicenseModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
