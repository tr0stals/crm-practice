import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseTypes } from './license-types.entity';
import { LicenseTypeDTO } from './dto/LicenseTypeDTO';

@Injectable()
export class LicenseTypesService {
  constructor(
    @InjectRepository(LicenseTypes)
    private licenseRepository: Repository<LicenseTypes>,
  ) {}

  async createLicenseType(data: LicenseTypeDTO) {
    try {
      const licenseType = this.licenseRepository.create(data);
      return await this.licenseRepository.save(licenseType);
    } catch (e) {
      console.error('Ошибка при создании LicenseTypes');
    }
  }

  async findById(data: number) {
    try {
      return await this.licenseRepository.findOne({ where: { id: data } });
    } catch (e) {
      console.error('Ошибка при поиске');
    }
  }

  async getLicenseTypes() {
    try {
      return await this.licenseRepository.find();
    } catch (e) {
      console.error('Ошибка при получении LicenseTypes');
    }
  }

  async update(id: number, license: LicenseTypeDTO) {
    try {
      await this.licenseRepository.update(id, license);
    } catch (e) {
      console.error(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.licenseRepository.delete(id);
    } catch (e) {
      console.error('Ошибка при удалении типа лицензии', e);
    }
  }
}
