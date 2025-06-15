import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Suppliers } from './suppliers.entity';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Post('create')
  async create(@Body() data: Partial<Suppliers>): Promise<Suppliers> {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll(): Promise<Suppliers[]> {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<Suppliers> {
    return await this.service.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Suppliers>,
  ): Promise<Suppliers> {
    return await this.service.update(id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.service.remove(id);
  }
}
