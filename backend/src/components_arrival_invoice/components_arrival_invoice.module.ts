    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ComponentsInvoice } from 'src/components_invoice/components_invoice.entity';
    import { ComponentsInvoiceService } from './components_arrival_invoice.service';
    import { ComponentsInvoiceController } from './components_arrival_invoice.controller';
    import { InvoicesArrivalModule } from 'src/Invoices_arrival/Invoices_arrival.module';
    import { ComponentsModule } from '../components/components.module'; // Связь с комплектующими

    @Module({
      imports: [
        TypeOrmModule.forFeature([ComponentsInvoice]),
        InvoicesArrivalModule, // Импорт модуля для связанной сущности
        ComponentsModule, // Импорт модуля для связанной сущности
      ],
      providers: [ComponentsInvoiceService],
      controllers: [ComponentsInvoiceController],
      exports: [ComponentsInvoiceService],
    })
    export class ComponentsInvoiceModule {}