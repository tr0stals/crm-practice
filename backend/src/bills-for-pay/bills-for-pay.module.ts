import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsForPay } from './bills-for-pay.entity';
import { BillsForPayService } from './bills-for-pay.service';
import { BillsForPayController } from './bills-for-pay.controller';
import { BillsComponents } from '../bills-components/bills-components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillsForPay, BillsComponents])],
  providers: [BillsForPayService],
  controllers: [BillsForPayController],
  exports: [BillsForPayService],
})
export class BillsForPayModule {} 