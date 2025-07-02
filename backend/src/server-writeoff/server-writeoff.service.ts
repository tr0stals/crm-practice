import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerWriteoff } from './server-writeoff.entity';

@Injectable()
export class ServerWriteoffService {
  constructor(
    @InjectRepository(ServerWriteoff)
    private readonly repo: Repository<ServerWriteoff>,
  ) {}

  async getAll() {
    return this.repo.find({
      relations: ['factory', 'components', 'currentTasks'],
    });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['factory', 'components', 'currentTasks'],
    });
  }

  async generateData() {
    try {
      const serverWriteoffs = await this.getAll();
      const data: any[] = [];

      if (!serverWriteoffs)
        throw new NotFoundException('Ошибка при поиске серверных списаний');

      serverWriteoffs.map((item) => {
        const { components, factory, currentTasks, ...defaultData } = item;
        const componentTitle = components.title;
        const factoryName = factory.shortName;
        const currentTaskTitle = currentTasks.title;

        data.push({
          ...defaultData,
          componentTitle,
          factoryName,
          currentTaskTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<ServerWriteoff>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ServerWriteoff>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
