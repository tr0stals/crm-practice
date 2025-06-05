import { Body, Controller, Get, Post } from '@nestjs/common';
import { PeoplesService } from './peoples.service';
import { PeoplesDTO } from './dto/PeoplesDTO';

@Controller('peoples')
export class PeoplesController {
  constructor(private readonly peoplesService: PeoplesService) {}

  @Post('create')
  async createPeople(@Body() data: PeoplesDTO) {
    return await this.peoplesService.create(data);
  }

  @Get('get')
  async getUsers() {
    return await this.peoplesService.getPeoples();
  }
}
