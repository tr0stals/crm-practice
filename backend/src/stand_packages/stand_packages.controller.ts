import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { StandPackagesService } from './stand_packages.service';
import { StandPackages } from './stand_packages.entity';
import { StandPackagesDTO } from './dto/StandPackagesDTO';

@Controller('stand_packages')
export class StandPackagesController {
  constructor(private readonly service: StandPackagesService) {}

  @Post('create')
  async create(@Body() data: StandPackagesDTO) {
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

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<StandPackages>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
