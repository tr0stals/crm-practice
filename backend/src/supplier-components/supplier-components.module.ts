import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierComponents } from './supplier-components.entity';
import { SupplierComponentsService } from './supplier-components.service';
import { SupplierComponentsController } from './supplier-components.controller';
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