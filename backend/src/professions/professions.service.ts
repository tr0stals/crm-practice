import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Professions } from './professions.entity';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectRepository(Professions)
    private professionsRepository: Repository<Professions>,
  ) {}

  async create(data: CreateProfessionDto) {
    // Проверяем, существует ли уже профессия с таким названием
    const existingProfession = await this.professionsRepository.findOne({
      where: { title: data.title },
    });

    if (existingProfession) {
      throw new ConflictException(
        `Профессия с названием "${data.title}" уже существует`,
      );
    }

    const profession = this.professionsRepository.create(data);
    return await this.professionsRepository.save(profession);
  }

  async getAll() {
    return await this.professionsRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const profession = await this.professionsRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!profession) {
      throw new NotFoundException(`Профессия с ID ${id} не найдена`);
    }

    return profession;
  }

  async update(id: number, data: UpdateProfessionDto) {
    // Проверяем существование профессии
    await this.findOne(id);

    // При обновлении также проверяем уникальность названия
    if (data.title) {
      const existingProfession = await this.professionsRepository.findOne({
        where: {
          title: data.title,
          id: Not(id), // исключаем текущую запись
        },
      });

      if (existingProfession) {
        throw new ConflictException(
          `Профессия с названием "${data.title}" уже существует`,
        );
      }
    }

    await this.professionsRepository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number) {
    return await this.professionsRepository.delete(id);
  }

  async findByTitle(title: string) {
    return await this.professionsRepository.findOne({
      where: { title },
    });
  }
}
