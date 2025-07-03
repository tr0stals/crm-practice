import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbOrderStates } from './pcb_order_states.entity';
import { PcbOrderStatesService } from './pcb_order_states.service';
import { PcbOrderStatesController } from './pcb_order_states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbOrderStates])],
  providers: [PcbOrderStatesService],
  controllers: [PcbOrderStatesController],
  exports: [PcbOrderStatesService]
})
export class PcbOrderStatesModule {}
