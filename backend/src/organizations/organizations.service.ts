import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizations } from './organizations.entity';
import { Repository } from 'typeorm';
import { OrganizationsDTO } from './dto/OrganizationsDTO';
import { OrganizationTypesService } from 'src/organization-types/organization-types.service';
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
      return await this.organizationRepository.find();
    } catch (e) {
      console.error('Ошибка при получении организаций!', e);
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
}
