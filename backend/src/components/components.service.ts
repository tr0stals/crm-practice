import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Components } from './components.entity';
import { COMPONENT_CATEGORIES } from './component_categories';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Components)
    private repository: Repository<Components>,
  ) {}

  async create(data: Partial<Components>): Promise<Components> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Components[]> {
    return await this.repository.find({
      relations: ['componentPlacements', 'componentPlacements.placementType'],
    });
  }

  async findOne(id: number): Promise<Components> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['componentPlacements', 'componentPlacements.placementType'],
    });
    if (!entity) {
      throw new NotFoundException(`Компонент с ID ${id} не найден`);
    }
    return entity;
  }

  async generateData() {
    try {
      const components = await this.findAll();
      const data: any[] = [];

      if (!components)
        throw new NotFoundException('Ошибка при поиске компонентов');

      components.map((item) => {
        const { componentPlacements, ...defaultData } = item;
        const placementType = item.componentPlacements.placementType;
        if (!placementType)
          throw new NotFoundException('Тип размещения не найден');

        const componentPlacementData = componentPlacements
          ? `${placementType.title}, Здание ${componentPlacements.building}, комната ${componentPlacements.room}`
          : 'Место не указано';

        data.push({
          ...defaultData,
          componentPlacementData,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<Components>): Promise<Components> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }

  async getComponentsTree() {
    const components = await this.repository.find();

    // Рекурсивная функция для поиска дочерних компонентов
    function buildComponentChildren(parentId) {
      return components
        .filter((c) => c.parentId === parentId)
        .map((c) => ({
          name: c.title,
          ...c,
          children: buildComponentChildren(c.id),
        }));
    }

    // Строим дерево по категориям и подкатегориям
    const tree = COMPONENT_CATEGORIES.map((category) => ({
      name: category.name,
      children: category.subcategories.map((subcat) => ({
        name: subcat.name,
        children: buildComponentChildren(subcat.id),
      })),
    }));

    return { name: 'Актуальный склад', children: tree };
  }
}
