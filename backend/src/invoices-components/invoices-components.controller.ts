import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InvoicesComponentsService } from './invoices-components.service';
import { InvoicesComponents } from './invoices-components.entity';

@Controller('invoices-components')
export class InvoicesComponentsController {
  constructor(private readonly service: InvoicesComponentsService) {}

  @Get('get')
  async get() {
    return await this.service.getAll();
  }

  @Get('get/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Post('create')
  async create(@Body() data: Partial<InvoicesComponents>) {
    return await this.service.create(data);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<InvoicesComponents>,
  ) {
    return await this.service.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.service.remove(id);
  }
}
