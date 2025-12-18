import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PCBS } from './pcbs.entity';
import { PCBSDTO } from './dto/PCBSDTO';
import { StandsService } from 'src/stands/stands.service';
import { WsGateway } from '../websocket/ws.gateway';
import { User } from 'src/user/user.entity';

@Injectable()
export class PcbsService {
  constructor(
    @InjectRepository(PCBS)
    private repository: Repository<PCBS>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private standService: StandsService,
    private wsGateway: WsGateway,
  ) {}

  async create(data: PCBSDTO, userId?: number) {
    try {
      const { standId, ...defaultData } = data;

      // Валидация: если это плата (заполнены дополнительные поля), то все обязательные поля должны быть заполнены
      const isPcb = this.isPcbData(standId);

      if (isPcb) {
        const missingFields = this.validatePcbFields(defaultData, standId);

        if (missingFields.length > 0) {
          const errorMessage = `Для создания платы необходимо заполнить все обязательные поля: ${missingFields.join(', ')}`;

          // Отправляем уведомление об ошибке валидации
          let targetUserId = userId ? userId.toString() : '1';

          // Если userId не передан, пытаемся найти пользователя напрямую
          if (!userId) {
            const directUser = await this.userRepository.findOne({
              where: {}, // Берем первого доступного пользователя
            });
            if (directUser) {
              targetUserId = directUser.id.toString();
              console.log(
                `[NOTIFICATION] Найден пользователь напрямую: ${directUser.id}, отправляем уведомление: ${errorMessage}`,
              );
            }
          }

          console.log(
            `[NOTIFICATION] Отправляем уведомление пользователю ${targetUserId}: ${errorMessage}`,
          );
          this.wsGateway.sendNotification(
            targetUserId,
            errorMessage,
            'validation_error',
          );

          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
      }

      let stand: any = undefined;

      if (standId) {
        stand = await this.standService.findOne(standId);
        if (!stand) throw new NotFoundException('Стенд не найден');
      }

      const entity = this.repository.create({
        ...defaultData,
        stands: stand,
      } as DeepPartial<PCBS>);

      const savedEntity = await this.repository.save(entity);

      // Отправляем уведомление об успешном создании
      const recordType = isPcb ? 'плата' : 'категория плат';
      const message = `Успешно создана ${recordType}: "${savedEntity.title}"`;
      let targetUserId = userId ? userId.toString() : '1';

      // Если userId не передан, пытаемся найти пользователя напрямую
      if (!userId) {
        const directUser = await this.userRepository.findOne({
          where: {}, // Берем первого доступного пользователя
        });
        if (directUser) {
          targetUserId = directUser.id.toString();
          console.log(
            `[NOTIFICATION] Найден пользователь напрямую: ${directUser.id}, отправляем уведомление: ${message}`,
          );
        }
      }

      console.log(
        `[NOTIFICATION] Отправляем уведомление пользователю ${targetUserId}: ${message}`,
      );
      this.wsGateway.sendNotification(targetUserId, message, 'success');

      return savedEntity;
    } catch (e) {
      throw new Error(e);
    }
  }

  // Метод для определения, является ли данные платой (а не категорией)
  private isPcbData(standId?: number): boolean {
    // Плата определяется наличием связанного стенда
    return !!standId;
  }

  // Валидация обязательных полей для платы
  private validatePcbFields(data: any, standId?: number): string[] {
    const missingFields: string[] = [];

    // Проверяем standId
    if (!standId) {
      missingFields.push('Стенд');
    }

    return missingFields;
  }

  async findAll(): Promise<PCBS[]> {
    return await this.repository.find({
      relations: ['stands', 'parent', 'children'],
    });
  }

  // Получить только категории (без плат)
  async findCategories(): Promise<PCBS[]> {
    const allItems = await this.repository.find({
      relations: ['parent', 'children', 'stands'],
    });
    return allItems.filter((item) => item.isCategory());
  }

  // Получить только платы (без категорий)
  async findPcbs(): Promise<PCBS[]> {
    const allItems = await this.repository.find({
      relations: [
        'stands',
        'parent',
        'pcbsComponents',
        'pcbsComponents.component',
      ],
    });
    return allItems.filter((item) => item.isPcb());
  }

  async findOne(id: number): Promise<PCBS> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['stands'],
    });
    if (!entity) {
      throw new NotFoundException(`Печатная плата с ID ${id} не найдена`);
    }
    return entity;
  }

  async generateData() {
    try {
      const pcbs = await this.findAll();
      const data: any[] = [];

      if (!pcbs) throw new NotFoundException('Ошибка при поиске печатных плат');

      pcbs.map((item) => {
        const { stands, ...defaultData } = item;
        const standTitle = stands?.title;

        data.push({
          ...defaultData,
          standTitle: standTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<PCBS>): Promise<PCBS> {
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

  async getPcbsTree() {
    const allItems = await this.repository.find({
      relations: [
        'stands',
        'parent',
        'children',
        'pcbsComponents',
        'pcbsComponents.component',
      ],
    });

    // Разделяем на категории и платы
    const categories = allItems.filter((item) => item.isCategory());
    const pcbs = allItems.filter((item) => item.isPcb());

    // Строим дерево категорий
    const buildCategoryTree = (parentId: number | null = null): any[] => {
      return categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          id: cat.id,
          name: cat.title,
          nodeType: 'pcbs_categories',
          isCategory: true,
          children: [
            // Рекурсивно добавляем подкатегории
            ...buildCategoryTree(cat.id),
            // Добавляем платы этой категории
            ...pcbs
              .filter((pcb) => pcb.parentId === cat.id)
              .map((pcb) => ({
                id: pcb.id,
                name: pcb.title || `Плата #${pcb.id}`,
                pcbName: pcb.title,
                nodeType: 'pcbs',
                isPcb: true,
                children: Array.isArray(pcb.pcbsComponents)
                  ? pcb.pcbsComponents.map((comp) => ({
                      name: `${comp.component?.title || `Компонент #${comp.id}`} (${comp.componentCount} шт)`,
                      nodeType: 'pcbs_components',
                      componentTitle: comp.component?.title,
                      material: comp.component?.material,
                      receiptDate: comp.component?.receiptDate,
                      id: comp.id,
                      componentCount: comp.componentCount,
                      component: comp.component,
                    }))
                  : [],
              })),
          ],
        }));
    };

    const tree = buildCategoryTree();

    // Добавляем платы без категории (parentId = null) на корневой уровень
    const rootPcbs = pcbs
      .filter((pcb) => pcb.parentId === null || pcb.parentId === undefined)
      .map((pcb) => ({
        id: pcb.id,
        name: pcb.title || `Плата #${pcb.id}`,
        pcbName: pcb.title,
        nodeType: 'pcbs',
        isPcb: true,
        children: Array.isArray(pcb.pcbsComponents)
          ? pcb.pcbsComponents.map((comp) => ({
              name: `${comp.component?.title || `Компонент #${comp.id}`} (${comp.componentCount} шт)`,
              nodeType: 'pcbs_components',
              componentTitle: comp.component?.title,
              material: comp.component?.material,
              receiptDate: comp.component?.receiptDate,
              id: comp.id,
              componentCount: comp.componentCount,
              component: comp.component,
            }))
          : [],
      }));

    return { name: 'Платы', children: [...rootPcbs, ...tree] };
  }

  async getTree() {
    const allItems = await this.repository.find({
      relations: [
        'stands',
        'parent',
        'children',
        'pcbsComponents',
        'pcbsComponents.component',
      ],
    });

    const categories = allItems.filter((item) => item.isCategory());
    const pcbs = allItems.filter((item) => item.isPcb());

    const buildTree = (parentId: number | null = null): any[] => {
      const categoryNodes = categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          id: cat.id,
          name: cat.title,
          nodeType: 'pcbs_categories',
          isCategory: true,
          children: buildTree(cat.id), // рекурсия вниз
        }));

      const pcbNodes = pcbs
        .filter((pcb) => pcb.parentId === parentId)
        .map((pcb) => ({
          id: pcb.id,
          name: pcb.title || `Плата #${pcb.id}`,
          pcbName: pcb.title,
          nodeType: 'pcbs',
          isPcb: true,
          children: [
            // Сначала дочерние платы
            ...buildTree(pcb.id),
            // Потом компоненты платы
            ...(Array.isArray(pcb.pcbsComponents)
              ? pcb.pcbsComponents.map((comp) => ({
                  id: comp.id,
                  name: `${comp.component?.title || `Компонент #${comp.id}`} (${comp.componentCount} шт)`,
                  nodeType: 'pcbs_components',
                  componentTitle: comp.component?.title,
                  material: comp.component?.material,
                  receiptDate: comp.component?.receiptDate,
                  componentCount: comp.componentCount,
                  component: comp.component,
                }))
              : []),
          ],
        }));

      return [...categoryNodes, ...pcbNodes];
    };

    const tree = buildTree();

    return {
      name: 'Платы',
      children: tree,
    };
  }
}
