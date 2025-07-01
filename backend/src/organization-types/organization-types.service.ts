import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationTypes } from './organization-types.entity';
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
      return await this.organizationTypesRepository.find();
    } catch (e) {
      console.error('Ошибка при получении типов организаций', e);
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
