import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentInvoice } from './Payment_invoice.entity';
import { PaymentInvoiceController } from './Payment_invoice.controller';
import { PaymentInvoiceService } from './Payment_invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentInvoice])],
  providers: [PaymentInvoiceService],
  controllers: [PaymentInvoiceController],
})
export class SendingBoxesModule {}