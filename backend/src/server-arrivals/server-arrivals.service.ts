import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerArrivals } from './server-arrivals.entity';

@Injectable()
export class ServerArrivalsService {
  constructor(
    @InjectRepository(ServerArrivals)
    private readonly repo: Repository<ServerArrivals>,
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
      const serverArrivals = await this.getAll();
      const data: any[] = [];

      if (!serverArrivals)
        throw new NotFoundException('Ошибка поиска приходов сервера');

      serverArrivals.map((item) => {
        const { components, factory, currentTasks, ...defaultData } = item;

        const componentTitle = components.title;
        const factoryName = factory.shortName;
        const currentTasksTitle = currentTasks.title;

        data.push({
          ...defaultData,
          componentTitle,
          factoryName,
          currentTasksTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<ServerArrivals>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ServerArrivals>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
