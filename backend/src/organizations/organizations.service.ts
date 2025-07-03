import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizations } from './organizations.entity';
import { Repository } from 'typeorm';
import { OrganizationsDTO } from './dto/OrganizationsDTO';
import { OrganizationTypesService } from 'src/organization_types/organization_types.service';
import { PeoplesService } from 'src/peoples/peoples.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organizations)
    private organizationRepository: Repository<Organizations>,
    private organizationTypesService: OrganizationTypesService,
    private peoplesService: PeoplesService,
  ) {}

  async create(data: OrganizationsDTO) {
    try {
      const organizationType = await this.organizationTypesService.findById(
        data.organizationTypeId,
      );

      const people = await this.peoplesService.findById(data.contactPeopleId);

      if (organizationType && people) {
        const organization = {
          parentId: data.parentId,
          fullName: data.fullName,
          shortName: data.shortName,
          comment: data.comment,
          digitalDocs: data.digitalDocs,
          email: data.email,
          factAddress: data.factAddress,
          inn: data.inn,
          kpp: data.kpp,
          lawAddress: data.lawAddress,
          orgn: data.orgn,
          phone: data.phone,
          orgnDate: data.orgnDate,
          postAddress: data.postAddress,
          rating: data.rating,
          organizationTypes: organizationType,
          peoples: people,
        };

        const newOrganization =
          this.organizationRepository.create(organization);
        return this.organizationRepository.save(newOrganization);
      }
    } catch (e) {
      console.error('Ошибка при создании организации', e);
    }
  }

  async get() {
    try {
      return await this.organizationRepository.find({
        relations: ['organizationTypes'],
      });
    } catch (e) {
      console.error('Ошибка при получении организаций!', e);
    }
  }

  async generateData() {
    const organizations = await this.get();
    const data: any[] = [];

    organizations?.map((item) => {
      const organizationTypeTitle = item.organizationTypes.title;
      const { parentId, organizationTypes, ...defaultData } = item;

      data.push({
        ...defaultData,
        organizationTypeTitle: organizationTypeTitle,
      });
    });

    return data;
  }

  async getById(incomingId: number) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: incomingId },
        relations: ['organizationTypes'],
      });

      if (!organization) throw new NotFoundException('Организация не найдена');

      return organization;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: OrganizationsDTO) {
    try {
      return await this.organizationRepository.update(id, data);
    } catch (e) {
      console.error('Ошибка при изменении организации', e);
    }
  }

  async remove(id: number) {
    try {
      return await this.organizationRepository.delete(id);
    } catch (e) {
      console.error('Ошибка при удалении организации', e);
    }
  }

  // Метод для построения дерева организаций по типам
  async getOrganizationsTree() {
    // Получаем все типы организаций с организациями
    const orgTypes = await this.organizationTypesService.get(); // relations: ['organizations']
    const result: any = {};
    result.name = 'Организации'; // временно жёстко, потом заменить на локализацию
    result.children = [];
    for (const orgType of orgTypes || []) {
      const orgTypeName = orgType.title;
      const orgs = orgType.organizations || [];
      result.children.push({
        name: orgTypeName,
        children: orgs.map((org) => ({ name: org.fullName, ...org })),
      });
    }
    return result;
  }
}
