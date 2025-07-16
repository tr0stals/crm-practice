import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsComponents } from './bills_components.entity';
import { BillsComponentsService } from './bills_components.service';
import { BillsComponentsController } from './bills_components.controller';
import { BillsForPay } from '../bills_for_pay/bills_for_pay.entity';
import { Components } from 'src/components/components.entity';
import { BillsForPayModule } from 'src/bills_for_pay/bills_for_pay.module';
import { ComponentsModule } from 'src/components/components.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillsComponents, BillsForPay, Components]),
    BillsForPayModule,
    ComponentsModule,
  ],
  providers: [BillsComponentsService],
  controllers: [BillsComponentsController],
  exports: [BillsComponentsService],
})
export class BillsComponentsModule {}
