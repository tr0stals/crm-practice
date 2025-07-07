import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BillsComponentsService } from './bills_components.service';
import { BillsComponents } from './bills_components.entity';

@Controller('bills_components')
export class BillsComponentsController {
  constructor(private readonly service: BillsComponentsService) {}

  @Get('get')
  async getAll() {
    return this.service.getAll();
  }

  @Get('generateData/:id')
  async generateDataById(@Param('id') id: string) {
    return await this.service.generateDataById(+id);
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
  async create(@Body() data: Partial<BillsComponents>) {
    return this.service.create(data);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<BillsComponents>,
  ) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
