import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Students } from './students.entity';

@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post('create')
  async create(@Body() data: Partial<Students>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Students>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
