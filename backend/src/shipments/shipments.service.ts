import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ShipmentsDTO } from './dto/shipmentsDTO';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { LicenseService } from 'src/license/license.service';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipments)
    private repository: Repository<Shipments>,
    private organizationService: OrganizationsService,
    private licenseService: LicenseService,
  ) {}

  async create(data: ShipmentsDTO) {
    try {
      const { clientId, factoryId, licenseId, transporterId, ...defaultData } =
        data;

      const client = await this.organizationService.getById(clientId);
      const factory = await this.organizationService.getById(factoryId);
      const transporter = await this.organizationService.getById(transporterId);
      const license = await this.licenseService.findById(licenseId);

      if (!client || !factory || !transporter || !license)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repository.create({
        ...defaultData,
        client: client,
        factory: factory,
        licenses: license,
        transporter: transporter,
      } as DeepPartial<Shipments>);

      return await this.repository.save(entity);
    } catch (e) {
      console.error('Ошибка при создании записи:', e);
      throw e;
    }
  }

  async update(id: number, data: ShipmentsDTO): Promise<Shipments> {
    try {
      await this.findOne(id);
      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error('Ошибка при обновлении записи', e);
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.repository.delete(id);
    } catch (e) {
      console.error('ошибка при удалении', e);
      throw e;
    }
  }

  async findOne(id: number): Promise<Shipments> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['licenses', 'factory', 'transporter', 'client'],
    });

    if (!entity) throw new NotFoundException(`Поставка с ${id} не найдена`);

    return entity;
  }

  async findAll(): Promise<Shipments[]> {
    try {
      return await this.repository.find({
        relations: ['licenses', 'factory', 'transporter', 'client'],
      });
    } catch (e) {
      console.error('Записи не найдены', e);
      throw e;
    }
  }

  async generateData() {
    try {
      const shipments = await this.findAll();
      const data: any[] = [];
      if (!shipments) throw new NotFoundException('Ошибка при поиске отгрузок');

      shipments.map((item) => {
        const { licenses, factory, transporter, client, ...defaultData } = item;

        const licenseCode = `Лицензия №${licenses?.licenseCode}`;
        const factoryTitle = factory?.shortName;
        const transporterTitle = transporter?.shortName;
        const clientTitle = client?.shortName;

        data.push({
          ...defaultData,
          licenseCode,
          factoryTitle,
          transporterTitle,
          clientTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
