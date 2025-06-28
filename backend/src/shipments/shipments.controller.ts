import { Body, Controller, Patch, Post, Param, Delete, Get } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsDTO } from './dto/shipmentsDTO';
import { Shipments } from './shipments.entity';

@Controller('shipments')
export class ShipmentsController {
    constructor(private readonly service: ShipmentsService) {}
    
      @Post('create')
      async create(@Body() data: ShipmentsDTO) {
        return await this.service.create(data);
      }
    
      @Patch('update/:id')
      async update(@Param('id') id: string, @Body() data: ShipmentsDTO) {
        return await this.service.update(+id, data);
      }
    
      @Delete('delete/:id')
      async remove(@Param('id') id: string) {
        return await this.service.remove(+id);
      }
    
      @Get('get/:id')
      async findOne(@Param('id') id:string) {
        return await this.service.findOne(+id);
      }

      @Get('get')
      async findAll() {
        return await this.service.findAll();
      }
}
