import { Module } from '@nestjs/common';
import { ArrivalInvoicesController } from './arrival_invoices.controller';
import { ArrivalInvoicesService } from './arrival_invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalInvoices } from './arrival_invoices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArrivalInvoices])],
  controllers: [ArrivalInvoicesController],
  providers: [ArrivalInvoicesService],
  exports: [ArrivalInvoicesService]
})
export class ArrivalInvoicesModule {}
