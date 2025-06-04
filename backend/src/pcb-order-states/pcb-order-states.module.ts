import { Module } from '@nestjs/common';
import { PcbOrderStatesController } from './pcb-order-states.controller';
import { PcbOrderStatesService } from './pcb-order-states.service';

@Module({
  controllers: [PcbOrderStatesController],
  providers: [PcbOrderStatesService]
})
export class PcbOrderStatesModule {}
