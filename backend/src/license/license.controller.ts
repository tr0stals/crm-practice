import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseDTO } from './dto/LicenseDTO';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post('create')
  async create(@Body() createLicense: LicenseDTO) {
    return this.licenseService.create(createLicense);
  }

  @Patch('update/:id')
  async update(@Param('id') id, @Body() updateLicense: LicenseDTO) {
    return this.licenseService.update(id, updateLicense);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id) {
    return this.licenseService.remove(id);
  }

  @Get('get')
  async find() {
    return this.licenseService.find();
  }

  @Get('generateData')
  async generateData() {
    return await this.licenseService.generateData();
  }
}
