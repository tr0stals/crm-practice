import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationTypesService } from './organization_types.service';
import { OrganizationTypesDTO } from './dto/OrganizationTypesDTO';

@Controller('organization_types')
export class OrganizationTypesController {
  constructor(
    private readonly organizationTypesService: OrganizationTypesService,
  ) {}

  @Post('create')
  async create(@Body() createOrganizationType: OrganizationTypesDTO) {
    return this.organizationTypesService.create(createOrganizationType);
  }

  @Get('get')
  async get() {
    return await this.organizationTypesService.get();
  }

  @Get('get/:id')
  async getById(@Param('id') id: string) {
    return await this.organizationTypesService.getById(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.organizationTypesService.generateData();
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateData: OrganizationTypesDTO,
  ) {
    return this.organizationTypesService.update(id, updateData);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    return await this.organizationTypesService.remove(id);
  }
}
