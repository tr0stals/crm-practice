import { Module } from '@nestjs/common';
import { OrganizationTypesService } from './organization_types.service';
import { OrganizationTypesController } from './organization_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationTypes } from './organization_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationTypes])],
  providers: [OrganizationTypesService],
  controllers: [OrganizationTypesController],
  exports: [OrganizationTypesService],
})
export class OrganizationTypesModule {}
