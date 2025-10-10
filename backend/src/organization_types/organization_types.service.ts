import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationTypes } from './organization_types.entity';
import { Repository } from 'typeorm';
import { OrganizationTypesDTO } from './dto/OrganizationTypesDTO';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class OrganizationTypesService implements OnModuleInit {
  constructor(
    @InjectRepository(OrganizationTypes)
    private organizationTypesRepository: Repository<OrganizationTypes>,

    private imagesService: ImagesService,
  ) {}

  async onModuleInit() {
    await this.ensureSystemTypes();
  }

  private async ensureSystemTypes() {
    const systemTitles = ['Фабрика', 'Перевозчик', 'Производитель', 'Клиент'];
    const existing = await this.organizationTypesRepository.find({
      where: systemTitles.map((title) => ({ title })),
      select: ['id', 'title'],
    });

    const existingSet = new Set(existing.map((e) => e.title));

    const toCreate = systemTitles
      .filter((t) => !existingSet.has(t))
      .map((title) => this.organizationTypesRepository.create({ title }));

    if (toCreate.length > 0) {
      await this.organizationTypesRepository.save(toCreate);
    }
  }

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
      const systemTitles = new Set(['Фабрика', 'Перевозчик', 'Производитель', 'Клиент']);
      const existing = await this.organizationTypesRepository.findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Тип организации не найден');
      if (systemTitles.has(existing.title)) {
        throw new ForbiddenException(
          'Системный тип нельзя изменять',
        );
      }

      return await this.organizationTypesRepository.update(id, data);
    } catch (e) {
      console.error('Ошибка при изменении типа организаций!', e);
    }
  }

  async remove(id: number) {
    try {
      const systemTitles = new Set(['Фабрика', 'Перевозчик', 'Производитель', 'Клиент']);
      const existing = await this.organizationTypesRepository.findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Тип организации не найден');
      if (systemTitles.has(existing.title)) {
        throw new ForbiddenException(
          'Системный тип нельзя удалять',
        );
      }

      await this.organizationTypesRepository.delete(id);
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

  // В organization-types.service.ts добавляем:
  async uploadIcon(id: number, file: Express.Multer.File) {
    const orgType = await this.getById(id);

    if (!orgType) {
      throw new NotFoundException('Organization type not found');
    }

    // Создаем запись в таблице images
    const image = await this.imagesService.createImage(file, id);

    // Обновляем поле icon для обратной совместимости
    orgType.icon = `/api/images/${image.id}`; // или `/api/images/filename/${image.filename}`

    await this.organizationTypesRepository.save(orgType);

    return {
      organizationType: orgType,
      image: image,
    };
  }

  async getOrganizationTypeWithImages(id: number) {
    return await this.organizationTypesRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }
}
