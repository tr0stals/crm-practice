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
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';
import { StandsDTO } from './dto/StandsDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('stands')
@UseGuards(JwtAuthGuard)
export class StandsController {
  constructor(private readonly service: StandsService) {}

  @Post('create')
  async create(@Body() data: StandsDTO, @Request() req) {
    // Получаем userId из JWT токена
    const userId = req.user?.id;
    return await this.service.create(data, userId);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('getParents')
  async getParents() {
    return await this.service.getParents();
  }

  @Get('categories')
  async getCategories() {
    return await this.service.findCategories();
  }

  @Get('byParent/:parentId')
  async getByParent(@Param('parentId') parentId: string) {
    const id = parentId === 'null' ? null : +parentId;
    return await this.service.findByParent(id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('tree')
  async getTree() {
    return await this.service.getTree();
  }

  @Get('getTree')
  async getTreeWithParent() {
    return await this.service.getTreeForWeb();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Stands>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
