import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Components } from './components.entity';
import { ComponentsCategories } from 'src/components_categories/components_categories.entity';
import { ComponentsDTO } from './dto/ComponentsDTO';
import { ComponentPlacementsService } from 'src/component_placements/component_placements.service';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Components)
    private repository: Repository<Components>,
    private componentPlacementService: ComponentPlacementsService,
  ) {}

  async create(data: ComponentsDTO) {
    try {
      const { placementId, ...defaultData } = data;
      const placement =
        await this.componentPlacementService.findOne(placementId);

      if (!placement) throw new Error('Не найден placement');

      const entity = this.repository.create({
        ...defaultData,
        componentPlacements: placement,
      } as DeepPartial<Components>);

      return await this.repository.save(entity);
    } catch (e) {
      throw new Error(e);
    }
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
        const placementType = componentPlacements?.placementType;
        if (!placementType)
          throw new NotFoundException('Тип размещения не найден');

        const componentPlacementData = componentPlacements
          ? `${placementType?.title}, Здание ${componentPlacements?.building}, комната ${componentPlacements?.room}`
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
    try {
      await this.findOne(id); // Проверяем существование
      await this.repository.delete(id);
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

  async getComponentsTree() {
    const [components, categories] = await Promise.all([
      this.repository.find({
        relations: ['componentPlacements', 'componentPlacements.placementType'],
      }),
      this.repository.manager.getRepository(ComponentsCategories).find({
        relations: ['subcategories'],
      }),
    ]);

    const getComponentsBySubcat = (subcatId: number, subcatName: string) =>
      components
        .filter((c) => c.parentId === subcatId)
        .map((c) => {
          const placement = c.componentPlacements;
          const placementInfo = placement
            ? `${placement.placementType?.title || ''}, Здание ${placement.building}, комната ${placement.room}`
            : '';
          return {
            name: c.title + ' | ' + placementInfo,
            nodeType: 'components',
            subcategoryName: subcatName,
            ...c,
            placementInfo,
            children: [],
          };
        });

    const tree = categories.map((category) => ({
      id: category.id,
      name: category.name,
      nodeType: 'components_categories',
      children: (category.subcategories || []).map((subcat) => ({
        id: subcat.id,
        name: subcat.name,
        nodeType: 'components_subcategories',
        children: getComponentsBySubcat(subcat.id, subcat.name),
      })),
    }));

    return { name: 'Актуальный склад', children: tree };
  }
}
