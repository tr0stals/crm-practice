import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbOrders } from './pcb-orders.entity';
import { PcbOrdersService } from './pcb-orders.service';
import { PcbOrdersController } from './pcb-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbOrders])],
  providers: [PcbOrdersService],
  controllers: [PcbOrdersController],
  exports: [PcbOrdersService]
})
export class PcbOrdersModule {}
