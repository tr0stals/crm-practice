import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbOrders } from './pcb_orders.entity';
import { PcbOrdersService } from './pcb_orders.service';
import { PcbOrdersController } from './pcb_orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbOrders])],
  providers: [PcbOrdersService],
  controllers: [PcbOrdersController],
  exports: [PcbOrdersService]
})
export class PcbOrdersModule {}
