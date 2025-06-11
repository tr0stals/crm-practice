import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Peoples } from './peoples.entity';
import { PeoplesDTO } from './dto/PeoplesDTO';

@Injectable()
export class PeoplesService {
  constructor(
    @InjectRepository(Peoples)
    private peoplesRepository: Repository<Peoples>,
  ) {}

  async create(data: PeoplesDTO) {
    const { email } = data;

    const existing = await this.peoplesRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const people = this.peoplesRepository.create(data);
    return await this.peoplesRepository.save(people);
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
      return await this.peoplesRepository.delete(id);
    } catch (e) {
      console.error('Ошибка при удалении People');
    }
  }
}
