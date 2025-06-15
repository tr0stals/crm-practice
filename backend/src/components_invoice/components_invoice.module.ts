import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentsInvoice } from './components_invoice.entity';
import { ComponentsInvoiceService } from './components_invoice.service';
import { ComponentsInvoiceController } from './components_invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentsInvoice])],
  providers: [ComponentsInvoiceService],
  controllers: [ComponentsInvoiceController],
  exports: [ComponentsInvoiceService]
})
export class ComponentsInvoiceModule {}