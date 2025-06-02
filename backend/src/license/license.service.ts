import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './license.entity';
import { Repository } from 'typeorm';
import { LicenseDTO } from './dto/LicenseDTO';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
  ) {}

  async create(license: LicenseDTO) {
    try {
      const newLicense = this.licenseRepository.create(license);
      return this.licenseRepository.save(newLicense);
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
      await this.licenseRepository.remove(id);
    } catch (e) {
      console.error(e);
    }
  }

  async find() {
    return this.licenseRepository.find();
  }
}
