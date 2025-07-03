import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillsForPay } from './bills_for_pay.entity';
import { BillsForPayService } from './bills_for_pay.service';

@Controller('bills_for_pay')
export class BillsForPayController {
  constructor(
    @InjectRepository(BillsForPay)
    private readonly billsForPayRepository: Repository<BillsForPay>,
    private readonly service: BillsForPayService,
  ) {}

  @Get('get')
  async getAll() {
    return this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Post('create')
  async create(@Body() data: Partial<BillsForPay>) {
    return this.service.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<BillsForPay>) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
