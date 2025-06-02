import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Components } from './components.entity';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { SupplierComponentsModule } from '../supplier-components/supplier-components.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Components]),
    SuppliersModule,
    SupplierComponentsModule
  ],
  providers: [ComponentsService],
  controllers: [ComponentsController],
  exports: [ComponentsService],
})
export class ComponentsModule {} 