import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PcbsService } from './pcbs.service';
import { PCBS } from './pcbs.entity';
import { PCBSDTO } from './dto/PCBSDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pcbs')
@UseGuards(JwtAuthGuard)
export class PcbsController {
  constructor(private readonly service: PcbsService) {}

  @Post('create')
  async create(@Body() data: PCBSDTO, @Request() req) {
    // Получаем userId из JWT токена
    const userId = req.user?.id;
    return await this.service.create(data, userId);
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
  async update(@Param('id') id: string, @Body() data: Partial<PCBS>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Get('tree')
  async getPcbsTree() {
    return this.service.getPcbsTree();
  }
}
