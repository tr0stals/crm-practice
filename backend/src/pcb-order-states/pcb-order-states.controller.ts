import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PcbOrderStatesService } from './pcb-order-states.service';
import { PcbOrderStates } from './pcb-order-states.entity';

@Controller('pcb-order-states')
export class PcbOrderStatesController {
  constructor(private readonly service: PcbOrderStatesService) {}

  @Post('create')
  async create(@Body() data: Partial<PcbOrderStates>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<PcbOrderStates>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
