import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsForPay } from './bills_for_pay.entity';
import { BillsForPayService } from './bills_for_pay.service';
import { BillsForPayController } from './bills_for_pay.controller';
import { BillsComponents } from '../bills_components/bills_components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillsForPay, BillsComponents])],
  providers: [BillsForPayService],
  controllers: [BillsForPayController],
  exports: [BillsForPayService],
})
export class BillsForPayModule {} 