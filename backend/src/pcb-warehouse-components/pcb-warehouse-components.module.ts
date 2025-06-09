import { Module } from '@nestjs/common';
import { PcbWarehouseComponentsController } from './pcb-warehouse-components.controller';
import { PcbWarehouseComponentsService } from './pcb-warehouse-components.service';

@Module({
  controllers: [PcbWarehouseComponentsController],
  providers: [PcbWarehouseComponentsService]
})
export class PcbWarehouseComponentsModule {}
