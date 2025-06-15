import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { StandCoursesService } from './stand-courses.service';
import { StandCourses } from './stand-courses.entity';

@Controller('stand-courses')
export class StandCoursesController {
  constructor(private readonly service: StandCoursesService) {}

  @Post('create')
  async create(@Body() data: Partial<StandCourses>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<StandCourses>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
