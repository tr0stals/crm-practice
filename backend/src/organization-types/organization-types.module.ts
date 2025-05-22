import { Module } from '@nestjs/common';
import { OrganizationTypesService } from './organization-types.service';
import { OrganizationTypesController } from './organization-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationTypes } from './organization-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationTypes])],
  providers: [OrganizationTypesService],
  controllers: [OrganizationTypesController],
  exports: [OrganizationTypesService],
})
export class OrganizationTypesModule {}
