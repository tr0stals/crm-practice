import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierComponents } from './supplier-components.entity';
import { SupplierComponentsService } from './supplier-components.service';
import { SupplierComponentsController } from './supplier-components.controller';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { ComponentsModule } from '../components/components.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierComponents]),
    SuppliersModule,
    ComponentsModule
  ],
  providers: [SupplierComponentsService],
  controllers: [SupplierComponentsController],
  exports: [SupplierComponentsService],
})
export class SupplierComponentsModule {} 