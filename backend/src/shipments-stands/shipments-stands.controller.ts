import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShipmentsStandsService } from './shipments-stands.service';
import { ShipmentsStands } from './shipments-stands.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shipments-stands')
export class ShipmentsStandsController {
  constructor(private readonly service: ShipmentsStandsService) {}

  @Post('create')
  async create(@Body() data: Partial<ShipmentsStands>) {
    return await this.service.create(data);
  }

  @Get('get')
  async getAll() {
    return await this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.getOne(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ShipmentsStands>,
  ) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(+id);
  }
}
