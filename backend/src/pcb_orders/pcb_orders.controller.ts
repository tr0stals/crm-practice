import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PcbOrdersService } from './pcb_orders.service';
import { PcbOrders } from './pcb_orders.entity';

@Controller('pcb_orders')
export class PcbOrdersController {
  constructor(private readonly service: PcbOrdersService) {}

  @Post('create')
  async create(@Body() data: Partial<PcbOrders>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<PcbOrders>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Get('tree')
  async getPcbOrdersTree() {
    return await this.service.getPcbOrdersTree();
  }
}
