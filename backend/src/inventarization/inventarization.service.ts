import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Inventarization } from './inventarization.entity';
import { InventarizationDTO } from './dto/InventarizationDTO';
import { Components } from 'src/components/components.entity';
import { ComponentsService } from 'src/components/components.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { InventarizationBusinessService, ComponentCalculationResult } from 'src/features/inventarization-business/inventarization-business.service';
import { InventarizationCalculationDTO, CreateInventarizationFromCalculationDTO } from 'src/features/inventarization-business/dto/inventarization-calculation.dto';

@Injectable()
export class InventarizationService {
  constructor(
    @InjectRepository(Inventarization)
    private readonly repo: Repository<Inventarization>,
    private componentService: ComponentsService,
    private ogranizationService: OrganizationsService,
    private inventarizationBusinessService: InventarizationBusinessService,
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

  async getInventarizationTree() {
    const inventarizations = await this.repo.find({
      relations: ['component', 'factory'],
    });

    // Группируем по дате инвентаризации
    const dateMap = new Map<string, any[]>();

    for (const inv of inventarizations) {
      // Преобразуем строку даты в объект Date
      const dateObj = new Date(inv.inventarizationDate);
      const dateKey = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const dateLabel = dateObj.toLocaleDateString('ru-RU');

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }

      const componentInfo = {
        name: `${inv.component?.title || 'Неизвестная компонента'} | ${inv.componentCount} шт.`,
        nodeType: 'components',
        componentTitle: inv.component?.title,
        componentCount: inv.componentCount,
        inventarizationQuality: inv.inventarizationQuality,
        factoryName: inv.factory?.shortName || inv.factory?.fullName,
        id: inv.id,
        component: inv.component,
        factory: inv.factory,
      };

      dateMap.get(dateKey)!.push(componentInfo);
    }

    const result: any = {
      name: 'Инвентаризация',
      children: [],
    };

    // Сортируем даты и создаем дерево
    const sortedDates = Array.from(dateMap.keys()).sort();

    for (const dateKey of sortedDates) {
      const dateLabel = new Date(dateKey);
      const components = dateMap.get(dateKey)!;

      // Получаем id первой записи инвентаризации для этой даты
      const firstInvForDate = inventarizations.find((inv) => {
        const invDate = new Date(inv.inventarizationDate)
          .toISOString()
          .split('T')[0];
        return invDate === dateKey;
      });

      result.children.push({
        name: dateLabel,
        nodeType: 'inventarization',
        id: firstInvForDate?.id,
        date: dateKey,
        children: components,
      });
    }

    return result;
  }

  /**
   * Рассчитать количество компонентов для инвентаризации
   */
  async calculateComponentCount(componentId: number, factoryId: number, calculationDate?: Date): Promise<ComponentCalculationResult> {
    return await this.inventarizationBusinessService.calculateComponentCount(
      componentId,
      factoryId,
      calculationDate
    );
  }

  /**
   * Массовый расчет количества компонентов
   */
  async calculateMultipleComponents(data: InventarizationCalculationDTO): Promise<ComponentCalculationResult[]> {
    return await this.inventarizationBusinessService.calculateMultipleComponents(data);
  }

  /**
   * Создать инвентаризацию на основе автоматического расчета
   */
  async createInventarizationFromCalculation(data: CreateInventarizationFromCalculationDTO): Promise<Inventarization[]> {
    return await this.inventarizationBusinessService.createInventarizationFromCalculation(data);
  }

  /**
   * Обновить количество компонента на основе расчета
   */
  async updateComponentQuantity(
    componentId: number,
    factoryId: number,
    calculationDate?: Date
  ): Promise<Components> {
    return await this.inventarizationBusinessService.updateComponentQuantity(
      componentId,
      factoryId,
      calculationDate
    );
  }

  /**
   * Массово обновить количество компонентов на основе расчета
   */
  async updateMultipleComponentsQuantity(data: InventarizationCalculationDTO): Promise<Components[]> {
    return await this.inventarizationBusinessService.updateMultipleComponentsQuantity(data);
  }

  /**
   * Пересчитать количество всех компонентов для фабрики
   */
  async recalculateAllComponentsForFactory(
    factoryId: number,
    calculationDate?: Date
  ): Promise<Components[]> {
    return await this.inventarizationBusinessService.recalculateAllComponentsForFactory(
      factoryId,
      calculationDate
    );
  }
}
