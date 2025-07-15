import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationTypes } from './organization_types.entity';
import { Repository } from 'typeorm';
import { OrganizationTypesDTO } from './dto/OrganizationTypesDTO';

@Injectable()
export class OrganizationTypesService {
  constructor(
    @InjectRepository(OrganizationTypes)
    private organizationTypesRepository: Repository<OrganizationTypes>,
  ) {}

  async create(createOrganizationType: OrganizationTypesDTO) {
    try {
      const orgType = this.organizationTypesRepository.create(
        createOrganizationType,
      );
      return await this.organizationTypesRepository.save(orgType);
    } catch (e) {
      console.error('Ошибка при создании типа организации!', e);
    }
  }

  async get() {
    try {
      return await this.organizationTypesRepository.find({
        relations: ['organizations'],
      });
    } catch (e) {
      console.error('Ошибка при получении типов организаций', e);
    }
  }

  async getById(id: number) {
    try {
      const orgType = await this.organizationTypesRepository.findOne({
        where: { id: id },
      });

      return orgType;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const types = await this.get();
      const data: any[] = [];

      if (!types)
        throw new NotFoundException('Ошибка поиска типов организаций!');

      types.map((item) => {
        const { organizations, ...defaultData } = item;

        data.push({
          ...defaultData,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(data: number) {
    try {
      return await this.organizationTypesRepository.findOne({
        where: { id: data },
      });
    } catch (e) {
      console.error('Ошибка при поиске по id');
    }
  }

  async update(id: number, data: OrganizationTypesDTO) {
    try {
      return await this.organizationTypesRepository.update(id, data);
    } catch (e) {
      console.error('Ошибка при изменении типа организаций!', e);
    }
  }

  async remove(id: number) {
    try {
      return await this.organizationTypesRepository.delete(id);
    } catch (e) {
      console.error('Ошибка при удалении типа организации!', e);
    }
  }
}
