import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ServerArrivalsService } from './server-arrivals.service';
import { ServerArrivals } from './server-arrivals.entity';

@Controller('server-arrivals')
export class ServerArrivalsController {
  constructor(private readonly service: ServerArrivalsService) {}

  @Get('get')
  async getAll() {
    return this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Post('create')
  async create(@Body() data: Partial<ServerArrivals>) {
    return this.service.create(data);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<ServerArrivals>) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
