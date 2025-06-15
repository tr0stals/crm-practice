import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbOrderStates } from './pcb-order-states.entity';
import { PcbOrderStatesService } from './pcb-order-states.service';
import { PcbOrderStatesController } from './pcb-order-states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbOrderStates])],
  providers: [PcbOrderStatesService],
  controllers: [PcbOrderStatesController],
  exports: [PcbOrderStatesService]
})
export class PcbOrderStatesModule {}
