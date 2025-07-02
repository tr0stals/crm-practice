import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './license.entity';
import { Repository } from 'typeorm';
import { LicenseDTO } from './dto/LicenseDTO';
import { LicenseTypes } from 'src/license-types/license-types.entity';
import { LicenseTypesService } from 'src/license-types/license-types.service';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    private licenseTypesService: LicenseTypesService,
  ) {}

  async create(data: LicenseDTO) {
    try {
      const licenseType = await this.licenseTypesService.findById(
        data.licenseTypeId,
      );

      if (licenseType) {
        const license = {
          licenseCode: data.licenseCode,
          comment: data.comment,
          end: data.end,
          start: data.start,
          places: data.places,
          timeout: data.timeout,
          licenseTypes: licenseType,
        };
        const newLicense = this.licenseRepository.create(license);
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

  async generateData() {
    try {
      const licenses = await this.find();
      const data: any[] = [];
      if (!licenses) throw new NotFoundException('Лицензии не найдены');

      licenses.map((item) => {
        const { licenseTypes, ...defaultData } = item;
        const licenseTypeTitle = licenseTypes.title;

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
