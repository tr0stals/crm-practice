import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ComponentPlacements } from './component_placements.entity';
import { ComponentPlacementsDTO } from './dto/ComponentPlacementsDTO';
import { ComponentPlacementType } from 'src/component_placement_type/component_placement_type.entity';

@Injectable()
export class ComponentPlacementsService {
  constructor(
    @InjectRepository(ComponentPlacements)
    private readonly repo: Repository<ComponentPlacements>,
    @InjectRepository(ComponentPlacementType)
    private readonly componentPlacementTypesRepository: Repository<ComponentPlacementType>,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['placementType'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['placementType'],
    });
  }

  async generateData() {
    try {
      const placements = await this.findAll();
      const data: any[] = [];

      if (!placements)
        throw new NotFoundException('Ошибка при поиске размещений компонентов');

      placements.map((item) => {
        const { placementType, ...defaultData } = item;
        const placementTypeTitle = placementType?.title;

        data.push({
          ...defaultData,
          placementTypeTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateTree() {
    try {
      // Получаем все типы размещений
      const types = await this.componentPlacementTypesRepository.find({
        order: { id: 'ASC' },
      });

      // Получаем все размещения с привязкой к типам
      const placements = await this.repo.find({
        relations: ['placementType'],
        order: { id: 'ASC' },
      });

      if (!types || !placements) {
        throw new NotFoundException(
          'Не удалось получить данные для дерева размещений компонентов',
        );
      }

      // Формируем дерево
      const tree = types.map((type) => {
        const children = placements
          .filter((p) => p.placementType?.id === type.id)
          .map((p) => ({
            id: p.id,
            name: `${p.placementType.title} / Здание: ${p.building} / Комната: ${p.room}`,
            nodeType: 'component_placements',
          }));

        return {
          id: type.id,
          name: type.title,
          nodeType: 'component_placement_types',
          children,
        };
      });

      return tree;
    } catch (error) {
      console.error('Ошибка при генерации дерева размещений:', error);
      throw new HttpException(
        'Ошибка при построении дерева размещений компонентов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: ComponentPlacementsDTO) {
    try {
      const { placementTypeId, ...defaultData } = data;
      const placementType =
        await this.componentPlacementTypesRepository.findOne({
          where: {
            id: placementTypeId,
          },
        });

      const entity = this.repo.create({
        placementType: placementType,
        ...defaultData,
      } as DeepPartial<ComponentPlacements>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<ComponentPlacements>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    try {
      await this.repo.delete(id);
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
}
