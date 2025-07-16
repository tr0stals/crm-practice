import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { StandPackages } from './stand_packages.entity';
import { StandPackagesDTO } from './dto/StandPackagesDTO';
import { StandsService } from 'src/stands/stands.service';

@Injectable()
export class StandPackagesService {
  constructor(
    @InjectRepository(StandPackages)
    private readonly repo: Repository<StandPackages>,
    private standService: StandsService,
  ) {}

  async create(data: StandPackagesDTO) {
    try {
      const { standId, ...defaultData } = data;

      const stand = await this.standService.findOne(standId);

      if (!stand) throw new NotFoundException('Не найдена сущность stand');

      const entity = this.repo.create({
        ...defaultData,
        stands: stand,
      } as DeepPartial<StandPackages>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    return await this.repo.find({ relations: ['stands'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ['stands'] });
  }

  async generateData() {
    try {
      const packages = await this.findAll();
      const data: any[] = [];

      if (!packages)
        throw new NotFoundException('Ошибка поиска ящиков стендов');

      packages.map((item) => {
        const { stands, ...defaultData } = item;
        const standTitle = stands?.title;

        data.push({
          ...defaultData,
          standTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<StandPackages>) {
    return await this.repo.update(id, data);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
