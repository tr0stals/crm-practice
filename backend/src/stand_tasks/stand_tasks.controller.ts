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
import { StandTasksService } from './stand_tasks.service';
import { StandTasks } from './stand_tasks.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StandTasksDTO } from './dto/StandTasksDTO';

@UseGuards(JwtAuthGuard)
@Controller('stand_tasks')
export class StandTasksController {
  constructor(private readonly service: StandTasksService) {}

  @Post('create')
  async create(@Body() data: StandTasksDTO) {
    return await this.service.create(data);
  }

  @Get('get')
  async getAll() {
    return await this.service.getAll();
  }

  @Get('getByStand/:id')
  async getByStand(@Param('id') id: string) {
    return await this.service.getAllByStand(+id);
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
  async update(@Param('id') id: string, @Body() data: Partial<StandTasks>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(+id);
  }

  @Post('complete/:id')
  async completeStandTask(@Param('id') id: string) {
    return await this.service.completeStandTask(+id);
  }

  @Get('byParent/:parentId')
  async getByParent(@Param('parentId') parentId: string) {
    // Если parentId пустой или 'null', ищем root задачи
    if (!parentId || parentId === 'null' || parentId === '') {
      return await this.service.getAllByParent(null);
    }
    return await this.service.getAllByParent(+parentId);
  }

  @Get('tree')
  async getTree() {
    return await this.service.getTree();
  }
}
