import { Module } from '@nestjs/common';
import { ArrivalInvoicesController } from './arrival-invoices.controller';
import { ArrivalInvoicesService } from './arrival-invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalInvoices } from './arrival-invoices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArrivalInvoices])],
  controllers: [ArrivalInvoicesController],
  providers: [ArrivalInvoicesService],
  exports: [ArrivalInvoicesService]
})
export class ArrivalInvoicesModule {}
