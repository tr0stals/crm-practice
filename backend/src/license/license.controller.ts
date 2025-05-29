import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseDTO } from './dto/LicenseDTO';

@Controller('license')
export class LicenseController {
    constructor (private readonly licenseService: LicenseService) {}

    @Post()
    async create(@Body() createLicense: LicenseDTO){
        return this.licenseService.create(createLicense);
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() updateLicense: LicenseDTO){
        return this.licenseService.update(id, updateLicense);
    }

    @Delete(':id')
    async remove(@Param('id') id){
        return this.licenseService.remove(id);
    }

    @Get()
    async find(){
        return this.licenseService.find();
    }
}
