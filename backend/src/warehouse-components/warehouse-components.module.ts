import { Module } from '@nestjs/common';
import { WarehouseComponentsController } from './warehouse-components.controller';
import { WarehouseComponentsService } from './warehouse-components.service';

@Module({
  controllers: [WarehouseComponentsController],
  providers: [WarehouseComponentsService]
})
export class WarehouseComponentsModule {}
