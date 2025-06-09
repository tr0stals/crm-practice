import { Module } from '@nestjs/common';
import { PcbOrdersController } from './pcb-orders.controller';
import { PcbOrdersService } from './pcb-orders.service';

@Module({
  controllers: [PcbOrdersController],
  providers: [PcbOrdersService]
})
export class PcbOrdersModule {}
