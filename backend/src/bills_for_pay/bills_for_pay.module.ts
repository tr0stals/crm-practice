import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsForPay } from './bills_for_pay.entity';
import { BillsForPayService } from './bills_for_pay.service';
import { BillsForPayController } from './bills_for_pay.controller';
import { BillsComponents } from '../bills_components/bills_components.entity';
import { Organizations } from 'src/organizations/organizations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillsForPay, BillsComponents, Organizations]),
  ],
  providers: [BillsForPayService],
  controllers: [BillsForPayController],
  exports: [BillsForPayService],
})
export class BillsForPayModule {}
