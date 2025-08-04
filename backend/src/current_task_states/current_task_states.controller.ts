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
import { CurrentTaskStatesService } from './current_task_states.service';
import { CurrentTaskStates } from './current_task_states.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('current_task_states')
export class CurrentTaskStatesController {
  constructor(private readonly service: CurrentTaskStatesService) {}

  @Post('create')
  async create(@Body() data: Partial<CurrentTaskStates>) {
    return await this.service.create(data);
  }

  @Get('get')
  async getAll() {
    return await this.service.getAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.getOne(+id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CurrentTaskStates>,
  ) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(+id);
  }
  
  @Get('tree')
  async getTasksTreeByStatus() {
    return await this.service.getTasksTreeByStatus();
  }
}
