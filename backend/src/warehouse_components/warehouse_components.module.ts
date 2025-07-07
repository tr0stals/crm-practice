import { Module } from '@nestjs/common';
import { WarehouseComponentsController } from './warehouse_components.controller';
import { ComponentsModule } from '../components/components.module';

@Module({
  imports: [ComponentsModule],
  controllers: [WarehouseComponentsController],
})
export class WarehouseComponentsModule {} 