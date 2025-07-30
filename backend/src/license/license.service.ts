import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './license.entity';
import { DeepPartial, Repository } from 'typeorm';
import { LicenseDTO } from './dto/LicenseDTO';
import { LicenseTypes } from 'src/license_types/license_types.entity';
import { LicenseTypesService } from 'src/license_types/license_types.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    @InjectRepository(License)
    private licenseTypesRepository: Repository<LicenseTypes>,
    private licenseTypesService: LicenseTypesService,
    private databaseService: DatabaseService,
  ) {}

  async create(data: LicenseDTO) {
    try {
      const { licenseTypeId, ...defaultData } = data;

      const licenseType =
        await this.licenseTypesService.findById(licenseTypeId);

      if (licenseType) {
        const newLicense = this.licenseRepository.create({
          ...defaultData,
          licenseTypes: licenseType,
        } as DeepPartial<License>);

        return this.licenseRepository.save(newLicense);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async update(id, license: LicenseDTO) {
    try {
      await this.licenseRepository.update(id, license);
    } catch (e) {
      console.error(e);
    }
  }

  async remove(id) {
    try {
      await this.licenseRepository.delete(id);
    } catch (e) {
      console.error(e);
    }
  }

  async find() {
    return this.licenseRepository.find({
      relations: ['licenseTypes'],
    });
  }

  async findById(id: number) {
    try {
      const license = await this.licenseRepository.findOne({
        where: { id: id },
        relations: ['licenseTypes'],
      });

      return license;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const licenses = await this.find();
      const data: any[] = [];
      if (!licenses) throw new NotFoundException('Лицензии не найдены');

      licenses.map((item) => {
        const { licenseTypes, ...defaultData } = item;
        const licenseTypeTitle = licenseTypes?.title;

        data.push({
          ...defaultData,
          licenseTypeTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
