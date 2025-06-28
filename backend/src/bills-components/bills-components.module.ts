import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsComponents } from './bills-components.entity';
import { BillsComponentsService } from './bills-components.service';
import { BillsComponentsController } from './bills-components.controller';
import { BillsForPay } from '../bills-for-pay/bills-for-pay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillsComponents, BillsForPay])],
  providers: [BillsComponentsService],
  controllers: [BillsComponentsController],
  exports: [BillsComponentsService],
})
export class BillsComponentsModule {} 