import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentsArrivalInvoice } from './components_arrival_invoice.entity';
import { ComponentsArrivalInvoiceService } from './components_arrival_invoice.service';
import { ComponentsArrivalInvoiceController } from './components_arrival_invoice.controller';
import { InvoicesArrivalModule } from 'src/Invoices_arrival/Invoices_arrival.module';
import { ComponentsModule } from '../components/components.module'; // Связь с комплектующими

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentsArrivalInvoice]),
    InvoicesArrivalModule, // Импорт модуля для связанной сущности
    ComponentsModule, // Импорт модуля для связанной сущности
  ],
  providers: [ComponentsArrivalInvoiceService],
  controllers: [ComponentsArrivalInvoiceController],
  exports: [ComponentsArrivalInvoiceService],
})
export class ComponentsArrivalInvoiceModule {}