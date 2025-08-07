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

  @Get('get/:id')
  async findById(@Param('id') id: string) {
    return this.licenseService.findById(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.licenseService.generateData();
  }

  @Get('tree')
  async getTree() {
    return await this.licenseService.getTree();
  }
}
