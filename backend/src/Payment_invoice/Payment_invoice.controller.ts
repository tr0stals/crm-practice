import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { PaymentInvoiceService } from './Payment_invoice.service';
import { PaymentInvoice } from './Payment_invoice.entity';

@Controller('payment-invoice')
export class PaymentInvoiceController {
  constructor(private readonly service: PaymentInvoiceService) {}

  @Post('create')
  async create(@Body() data: Partial<PaymentInvoice>): Promise<PaymentInvoice> {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll(): Promise<PaymentInvoice[]> {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<PaymentInvoice> {
    return await this.service.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PaymentInvoice>,
  ): Promise<PaymentInvoice> {
    return await this.service.update(id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.service.remove(id);
  }
} 