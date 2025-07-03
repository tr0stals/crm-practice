import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierComponents } from './supplier_components.entity';
import { SupplierComponentsService } from './supplier_components.service';
import { SupplierComponentsController } from './supplier_components.controller';
import { ComponentsModule } from '../components/components.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierComponents]),
    ComponentsModule
  ],
  providers: [SupplierComponentsService],
  controllers: [SupplierComponentsController],
  exports: [SupplierComponentsService],
})
export class SupplierComponentsModule {} 