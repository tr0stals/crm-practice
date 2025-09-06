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
import { ComponentsService } from './components.service';
import { Components } from './components.entity';
import { ComponentsDTO } from './dto/ComponentsDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('components')
@UseGuards(JwtAuthGuard)
export class ComponentsController {
  constructor(private readonly service: ComponentsService) {}

  @Post('create')
  async create(@Body() data: ComponentsDTO, @Request() req) {
    // Получаем userId из JWT токена
    const userId = req.user?.id;
    return await this.service.create(data, userId);
  }

  @Get('get')
  async findAll(): Promise<Components[]> {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<Components> {
    return await this.service.findOne(id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
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
