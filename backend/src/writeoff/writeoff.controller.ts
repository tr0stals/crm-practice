import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WriteoffService } from './writeoff.service';
import { Writeoff } from './writeoff.entity';
import { WriteoffDTO } from './dto/WriteoffDTO';

@Controller('writeoff')
export class WriteoffController {
  constructor(private readonly service: WriteoffService) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() data: WriteoffDTO, @Request() req?: any) {
    // Получаем userId из JWT токена
    const userId = req?.user?.id || req?.user?.sub;
    return this.service.create(data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Writeoff>, @Request() req?: any) {
    // Получаем userId из JWT токена
    const userId = req?.user?.id || req?.user?.sub;
    return this.service.update(+id, data, userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
