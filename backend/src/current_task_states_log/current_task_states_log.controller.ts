import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CurrentTaskStatesLogService } from './current_task_states_log.service';
import { CurrentTaskStatesLog } from './current_task_states_log.entity';

@Controller('current_task_states_log')
export class CurrentTaskStatesLogController {
  constructor(private readonly service: CurrentTaskStatesLogService) {}

  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('task/:taskId')
  async getByTaskId(@Param('taskId') taskId: number) {
    return await this.service.getByTaskId(taskId);
  }

  @Get('state/:stateId')
  async getByStateId(@Param('stateId') stateId: number) {
    return await this.service.getByStateId(stateId);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }

  @Post()
  async create(@Body() data: Partial<CurrentTaskStatesLog>) {
    return await this.service.create(data);
  }

  @Post('logChange')
  async logStateChange(
    @Body() data: { taskId: number; stateId: number }
  ) {
    return await this.service.logStateChange(data.taskId, data.stateId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<CurrentTaskStatesLog>
  ) {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.service.delete(id);
  }
} 