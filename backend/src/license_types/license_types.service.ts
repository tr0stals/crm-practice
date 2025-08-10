import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseTypes } from './license_types.entity';
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

  async generateData() {
    try {
      const licenseTypes = await this.getLicenseTypes();
      const data: any[] = [];

      if (!licenseTypes)
        throw new NotFoundException('Ошибка поиска типов лицензий');

      licenseTypes.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
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

  async getLicenseTypeById(incomingId: number) {
    const licenseType = await this.licenseRepository.findOne({
      where: { id: incomingId },
    });

    if (!licenseType)
      throw new NotFoundException(`Тип лицензия с id ${incomingId} не найден`);

    return licenseType;
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
      await this.licenseRepository.delete(id);
    } catch (e: any) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        const match = e.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
        let tableName = match ? match[2] : '';

        throw new HttpException(
          {
            message: `Невозможно удалить запись. Есть связанные записи в таблице "${tableName}". Удалите их сначала.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }
}
