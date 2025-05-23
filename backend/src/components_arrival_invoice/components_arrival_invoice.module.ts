import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentsArrivalInvoice } from './components_arrival_invoice.entity';
import { ComponentsArrivalInvoiceService } from './components_arrival_invoice.service';
import { ComponentsArrivalInvoiceController } from './components_arrival_invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentsArrivalInvoice])],
  providers: [ComponentsArrivalInvoiceService],
  controllers: [ComponentsArrivalInvoiceController],
})
export class ComponentsArrivalInvoiceModule {}