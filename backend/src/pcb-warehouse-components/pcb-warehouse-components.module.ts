import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbWarehouseComponents } from './pcb-warehouse-components.entity';
import { PcbWarehouseComponentsService } from './pcb-warehouse-components.service';
import { PcbWarehouseComponentsController } from './pcb-warehouse-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbWarehouseComponents])],
  providers: [PcbWarehouseComponentsService],
  controllers: [PcbWarehouseComponentsController],
  exports: [PcbWarehouseComponentsService]
})
export class PcbWarehouseComponentsModule {}
