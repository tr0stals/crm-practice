import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { Components } from './components.entity';

@Controller('components')
export class ComponentsController {
  constructor(private readonly service: ComponentsService) {}

  @Post('create')
  async create(@Body() data: Partial<Components>): Promise<Components> {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll(): Promise<Components[]> {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<Components> {
    return await this.service.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Components>,
  ): Promise<Components> {
    return await this.service.update(id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.service.remove(id);
  }

  @Get('tree')
  async getComponentsTree() {
    return this.service.getComponentsTree();
  }
} 