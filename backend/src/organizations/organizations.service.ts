import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizations } from './organizations.entity';
import { Repository } from 'typeorm';
import { OrganizationsDTO } from './dto/OrganizationsDTO';
import { OrganizationTypesService } from 'src/organization_types/organization_types.service';
import { PeoplesService } from 'src/peoples/peoples.service';
import { Images } from 'src/images/images.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organizations)
    private organizationRepository: Repository<Organizations>,
    private organizationTypesService: OrganizationTypesService,
    private peoplesService: PeoplesService,

    @InjectRepository(Images)
    private imageRepository: Repository<Images>,
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
        relations: ['peoples', 'organizationTypes'],
      });
    } catch (e) {
      console.error('Ошибка при получении организаций!', e);
    }
  }

  async generateData() {
    const organizations = await this.get();
    const data: any[] = [];

    organizations?.map((item) => {
      const organizationTypeTitle = item.organizationTypes?.title;
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
        relations: ['peoples', 'organizationTypes'],
      });

      if (!organization) throw new NotFoundException('Организация не найдена');

      return organization;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: OrganizationsDTO) {
    try {
      await this.organizationRepository.update(id, data);
      return this.getById(id);
    } catch (e) {
      console.error('Ошибка при изменении организации', e);
    }
  }

  async remove(id: number) {
    try {
      await this.organizationRepository.delete(id);
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

  // Метод для построения дерева организаций по типам
  async getOrganizationsTree() {
    // Получаем все типы организаций с их организациями
    const orgTypes = await this.organizationTypesService.get();

    const result: any = {
      name: 'Организации', // можно вынести в локализацию
      children: [],
    };

    for (const orgType of orgTypes || []) {
      const orgTypeName = orgType.title;
      const orgs = orgType.organizations || [];

      // ищем иконку в images через targetType/targetId
      const image = await this.imageRepository.findOne({
        where: {
          targetType: 'organization_types',
          targetId: orgType.id,
        },
      });

      // мапа для быстрого доступа к оргам по id
      const orgMap = new Map<number, any>();

      // создаём узлы для всех организаций
      orgs.forEach((org) => {
        orgMap.set(org.id, {
          name: org.fullName,
          nodeType: 'organizations',
          children: [],
          ...org,
        });
      });

      // собираем иерархию по parentId
      const roots: any[] = [];
      orgMap.forEach((orgNode) => {
        if (orgNode.parentId && orgMap.has(orgNode.parentId)) {
          orgMap.get(orgNode.parentId).children.push(orgNode);
        } else {
          roots.push(orgNode);
        }
      });

      result.children.push({
        id: orgType.id,
        icon: image?.path || null,
        name: orgTypeName,
        nodeType: 'organization_types',
        children: roots,
      });
    }

    return result;
  }
}
