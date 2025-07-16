import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Inventarization } from './inventarization.entity';
import { InventarizationDTO } from './dto/InventarizationDTO';
import { ComponentsService } from 'src/components/components.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class InventarizationService {
  constructor(
    @InjectRepository(Inventarization)
    private readonly repo: Repository<Inventarization>,
    private componentService: ComponentsService,
    private ogranizationService: OrganizationsService,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['component', 'factory'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['component', 'factory'],
    });
  }

  async generateData() {
    try {
      const inventarizations = await this.findAll();
      const data: any[] = [];

      if (!inventarizations)
        throw new NotFoundException('Ошибка при поиске инвентаризации');

      inventarizations.map((item) => {
        const { component, factory, ...defaultData } = item;
        const componentTitle = component?.title;
        const factoryTitle = factory?.shortName;

        data.push({
          ...defaultData,
          componentTitle,
          factoryTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: InventarizationDTO) {
    try {
      const { componentId, factoryId, ...defaultData } = data;

      const component = await this.componentService.findOne(componentId);
      const factory = await this.ogranizationService.getById(factoryId);

      if (!component) throw new Error('Не найдена компонента');
      if (!factory) throw new Error('Не найдена фабрика');

      const entity = this.repo.create({
        ...defaultData,
        component: component,
        factory: factory,
      } as DeepPartial<Inventarization>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<Inventarization>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
