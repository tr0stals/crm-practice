import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Departments } from './departments.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Post()
  create(@Body() data: Partial<Departments>) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Departments>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
