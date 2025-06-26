import { Module } from '@nestjs/common';
import { ArrivalInvoicesController } from './arrival-invoices.controller';
import { ArrivalInvoicesService } from './arrival-invoices.service';

@Module({
  controllers: [ArrivalInvoicesController],
  providers: [ArrivalInvoicesService]
})
export class ArrivalInvoicesModule {}
