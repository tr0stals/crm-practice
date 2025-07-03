import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsComponents } from './bills_components.entity';
import { BillsComponentsService } from './bills_components.service';
import { BillsComponentsController } from './bills_components.controller';
import { BillsForPay } from '../bills_for_pay/bills_for_pay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillsComponents, BillsForPay])],
  providers: [BillsComponentsService],
  controllers: [BillsComponentsController],
  exports: [BillsComponentsService],
})
export class BillsComponentsModule {} 