import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ServerWriteoffService } from './server-writeoff.service';
import { ServerWriteoff } from './server-writeoff.entity';

@Controller('server-writeoff')
export class ServerWriteoffController {
  constructor(private readonly service: ServerWriteoffService) {}

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
  async create(@Body() data: Partial<ServerWriteoff>) {
    return this.service.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<ServerWriteoff>) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
