import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './license.entity';
import { DeepPartial, Repository } from 'typeorm';
import { LicenseDTO } from './dto/LicenseDTO';
import { LicenseTypes } from 'src/license_types/license_types.entity';
import { LicenseTypesService } from 'src/license_types/license_types.service';
import { DatabaseService } from 'src/database/database.service';
import { Shipments } from 'src/shipments/shipments.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { Stands } from 'src/stands/stands.entity';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    @InjectRepository(LicenseTypes)
    private licenseTypesRepository: Repository<LicenseTypes>,
    private licenseTypesService: LicenseTypesService,
    private databaseService: DatabaseService,
    @InjectRepository(Shipments)
    private shipmentsRepo: Repository<Shipments>,
    @InjectRepository(ShipmentsStands)
    private shipmentStandsRepo: Repository<ShipmentsStands>,
    @InjectRepository(Stands)
    private standsRepo: Repository<Stands>,
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

  async getTree() {
    try {
      const licenses = await this.find();
      const shipments = await this.shipmentsRepo.find({
        relations: ['licenses'],
      });
      const licenseTypes = await this.licenseTypesRepository.find();

      const shipmentStands = await this.shipmentStandsRepo.find({
        relations: ['shipments', 'stands'],
      });

      if (!licenses) throw new NotFoundException('Ошибка поиска лицензий');
      if (!shipments) throw new NotFoundException('Ошибка поиска отгрузок');
      if (!shipmentStands)
        throw new NotFoundException('Ошибка поиска отгрузок стендов');

      const tree = licenseTypes.map((licenseType: LicenseTypes) => {
        console.log('licenseType', licenseType);
        return {
          id: licenseType.id,
          name: licenseType.title,
          nodeType: 'license_types',
          children: licenses
            .filter(
              (license: License) => license.licenseTypes?.id === licenseType.id,
            )
            .map((license: License) => {
              const licenseShipment = shipments.find(
                (shipment) => shipment.licenses?.id === license.id,
              );

              const shipmentStand = shipmentStands
                .filter(Boolean)
                .find(
                  (shipment) => shipment.shipments?.id === licenseShipment?.id,
                );

              const placesCount =
                licenseType?.title !== 'Пробная' ? license?.places : '';
              const standTitle = shipmentStand?.stands?.title || '';

              return {
                id: license.id,
                name: `${license.licenseCode} ${standTitle ? ' | Стенд: ' + standTitle : ''} | ${placesCount ? 'Кол-во мест: ' + placesCount : ''}`,
                nodeType: 'license',
              };
            }),
        };
      });

      return { name: 'Лицензии', children: tree };
    } catch (e) {
      throw new Error(e);
    }
  }
}
