import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Components } from './components.entity';
import { ComponentsDTO } from './dto/ComponentsDTO';
import { ComponentPlacementsService } from 'src/component_placements/component_placements.service';
import { WsGateway } from '../websocket/ws.gateway';
import { User } from 'src/user/user.entity';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Components)
    private repository: Repository<Components>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private componentPlacementService: ComponentPlacementsService,
    private wsGateway: WsGateway,
  ) {}

  async create(data: ComponentsDTO, userId?: number) {
    try {
      const { placementId, ...defaultData } = data;
      
      // Валидация: если это компонент (заполнены дополнительные поля), то все обязательные поля должны быть заполнены
      const isComponent = this.isComponentData(defaultData);
      if (isComponent) {
        const missingFields = this.validateComponentFields(defaultData, placementId);
        if (missingFields.length > 0) {
          const errorMessage = `Для создания компонента необходимо заполнить все обязательные поля: ${missingFields.join(', ')}`;
          
          // Отправляем уведомление об ошибке валидации
          let targetUserId = userId ? userId.toString() : '1';
          
          // Если userId не передан, пытаемся найти пользователя напрямую
          if (!userId) {
            const directUser = await this.userRepository.findOne({
              where: {}, // Берем первого доступного пользователя
            });
            if (directUser) {
              targetUserId = directUser.id.toString();
              console.log(`[NOTIFICATION] Найден пользователь напрямую: ${directUser.id}, отправляем уведомление: ${errorMessage}`);
            }
          }
          
          console.log(`[NOTIFICATION] Отправляем уведомление пользователю ${targetUserId}: ${errorMessage}`);
          this.wsGateway.sendNotification(targetUserId, errorMessage, 'validation_error');
          
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
      }

      let placement: any = undefined;
      if (placementId) {
        placement = await this.componentPlacementService.findOne(placementId);
        if (!placement) throw new Error('Не найден placement');
      }

      const entity = this.repository.create({
        ...defaultData,
        componentPlacements: placement,
      } as DeepPartial<Components>);

      const savedEntity = await this.repository.save(entity);
      
      // Отправляем уведомление об успешном создании
      const recordType = isComponent ? 'компонент' : 'категорию компонентов';
      const message = `Успешно создан ${recordType}: "${savedEntity.title}"`;
      let targetUserId = userId ? userId.toString() : '1';
      
      // Если userId не передан, пытаемся найти пользователя напрямую
      if (!userId) {
        const directUser = await this.userRepository.findOne({
          where: {}, // Берем первого доступного пользователя
        });
        if (directUser) {
          targetUserId = directUser.id.toString();
          console.log(`[NOTIFICATION] Найден пользователь напрямую: ${directUser.id}, отправляем уведомление: ${message}`);
        }
      }
      
      console.log(`[NOTIFICATION] Отправляем уведомление пользователю ${targetUserId}: ${message}`);
      this.wsGateway.sendNotification(targetUserId, message, 'success');
      
      return savedEntity;
    } catch (e) {
      throw new Error(e);
    }
  }

  // Метод для определения, является ли данные компонентом (а не категорией)
  private isComponentData(data: any): boolean {
    return !!(data.photo || data.width || data.height || data.thickness || 
              data.weight || data.material || data.receiptDate || data.drawingReference);
  }

  // Валидация обязательных полей для компонента
  private validateComponentFields(data: any, placementId?: number): string[] {
    const missingFields: string[] = [];
    
    // Обязательные поля для компонента
    const requiredFields = [
      { field: 'photo', name: 'Фото' },
      { field: 'width', name: 'Ширина' },
      { field: 'height', name: 'Высота' },
      { field: 'thickness', name: 'Толщина' },
      { field: 'weight', name: 'Вес' },
      { field: 'material', name: 'Материал' },
      { field: 'receiptDate', name: 'Дата поступления' },
      { field: 'drawingReference', name: 'Чертеж' },
    ];

    // Проверяем каждое обязательное поле
    for (const { field, name } of requiredFields) {
      if (!data[field] || data[field] === '' || data[field] === null) {
        missingFields.push(name);
      }
    }

    // Проверяем placementId
    if (!placementId) {
      missingFields.push('Размещение');
    }

    return missingFields;
  }

  async findAll(): Promise<Components[]> {
    return await this.repository.find({
      relations: ['componentPlacements', 'componentPlacements.placementType', 'parent', 'children'],
    });
  }

  // Получить только категории (без компонентов)
  async findCategories(): Promise<Components[]> {
    const allItems = await this.repository.find({
      relations: ['parent', 'children', 'componentPlacements'],
    });
    return allItems.filter(item => item.isCategory());
  }

  // Получить только компоненты (без категорий)
  async findComponents(): Promise<Components[]> {
    const allItems = await this.repository.find({
      relations: ['componentPlacements', 'componentPlacements.placementType', 'parent'],
    });
    return allItems.filter(item => item.isComponent());
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
    const allItems = await this.repository.find({
      relations: ['componentPlacements', 'componentPlacements.placementType', 'parent', 'children'],
    });

    // Разделяем на категории и компоненты
    const categories = allItems.filter(item => item.isCategory());
    const components = allItems.filter(item => item.isComponent());

    // Строим дерево категорий
    const buildCategoryTree = (parentId: number | null = null): any[] => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(cat => ({
          id: cat.id,
          name: cat.title,
          nodeType: 'components_categories',
          isCategory: true,
          children: [
            // Рекурсивно добавляем подкатегории
            ...buildCategoryTree(cat.id),
            // Добавляем компоненты этой категории
            ...components
              .filter(comp => comp.parentId === cat.id)
              .map(comp => {
                const placement = comp.componentPlacements;
                const placementInfo = placement
                  ? `${placement.placementType?.title || ''}, Здание ${placement.building}, комната ${placement.room}`
                  : '';
                return {
                  name: comp.title + ' | ' + placementInfo,
                  nodeType: 'components',
                  placementInfo,
                  ...comp,
                  children: [],
                };
              })
          ],
        }));
    };

    const tree = buildCategoryTree();

    // Добавляем компоненты без категории (parentId = null) на корневой уровень
    const rootComponents = components
      .filter(comp => comp.parentId === null || comp.parentId === undefined)
      .map(comp => {
        const placement = comp.componentPlacements;
        const placementInfo = placement
          ? `${placement.placementType?.title || ''}, Здание ${placement.building}, комната ${placement.room}`
          : '';
        return {
          name: comp.title + ' | ' + placementInfo,
          nodeType: 'components',
          placementInfo,
          ...comp,
          children: [],
        };
      });

    return { name: 'Актуальный склад', children: [...rootComponents, ...tree] };
  }
}
