import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Peoples } from './peoples.entity';
import { PeoplesDTO } from './dto/PeoplesDTO';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Organizations } from 'src/organizations/organizations.entity';

@Injectable()
export class PeoplesService {
  constructor(
    @InjectRepository(Peoples)
    private peoplesRepository: Repository<Peoples>,
    @InjectRepository(Organizations)
    private organizationsRepo: Repository<Organizations>,
  ) {}

  async create(data: PeoplesDTO) {
    const { email } = data;

    const existing = await this.peoplesRepository.findOne({
      where: { email },
    });

    if (existing) return existing;

    const people = this.peoplesRepository.create(data);
    return await this.peoplesRepository.save(people);
  }

  async findById(data: number) {
    try {
      return await this.peoplesRepository.findOne({ where: { id: data } });
    } catch (e) {
      console.error('Ошибка при поиске по id', e);
    }
  }

  async generateData() {
    try {
      const peoples = await this.getPeoples();
      const data: any[] = [];

      peoples?.map((item) => {
        const fullname = `${item?.firstName} ${item?.middleName} ${item?.lastName}`;

        data.push({
          id: item.id,
          fullname: fullname,
          phone: item.phone,
          email: item.email,
          birthDate: item.birthDate,
          comment: item.comment,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getPeoples() {
    try {
      return await this.peoplesRepository.find();
    } catch (e) {
      console.error('Ошибка при получении Peoples');
    }
  }

  async update(id: number, people: PeoplesDTO) {
    try {
      await this.peoplesRepository.update(id, people);
    } catch (e) {
      console.error('Ошибка при редактировании People');
    }
  }

  async remove(id: any) {
    try {
      await this.peoplesRepository.delete(id);
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

  async getTree() {
    try {
      const organizations = await this.organizationsRepo.find({
        relations: ['peoples', 'organizationTypes'],
      });
      const peoples = await this.getPeoples();

      if (!organizations) {
        alert('Ошибка при поиске организаций');
        throw new NotFoundException('Ошибка при поиске организаций');
      }

      if (!peoples) {
        alert('Ошибка при поиске людей');
        throw new NotFoundException('Ошибка при поиске людей');
      }

      const tree = organizations.map((org: Organizations) => ({
        id: org.id,
        name: org.shortName,
        nodeType: 'organizations',
        children: peoples
          .filter((people) => org.peoples?.id === people.id)
          .map((people: Peoples) => ({
            id: people.id,
            name: `${people.lastName} ${people.firstName} ${people.middleName} | ${people.phone}`,
            nodeType: 'peoples',
          })),
      }));

      return { name: 'Люди', children: tree };
    } catch (e) {
      throw new Error(e);
    }
  }
}
