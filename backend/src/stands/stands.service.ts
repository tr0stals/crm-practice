import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { Stands } from './stands.entity';
import { StandsDTO } from './dto/StandsDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { StandTypesService } from 'src/stand_types/stand_types.service';
import { WsGateway } from '../websocket/ws.gateway';
import { User } from 'src/user/user.entity';
import { StandsTypes } from 'src/stand_types/stand_types.entity';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(Stands)
    private readonly repo: Repository<Stands>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private employeeService: EmployeesService,
    private standTypeService: StandTypesService,
    private wsGateway: WsGateway,
  ) {}

  async create(data: StandsDTO, userId?: number) {
    try {
      const { employeeId, standTypeId, ...defaultData } = data;

      // Валидация: если это стенд (заполнены дополнительные поля), то все обязательные поля должны быть заполнены
      const isStand = this.isStandData(defaultData);
      if (isStand) {
        const missingFields = this.validateStandFields(
          defaultData,
          employeeId,
          standTypeId,
        );
        if (missingFields.length > 0) {
          const errorMessage = `Для создания стенда необходимо заполнить все обязательные поля: ${missingFields.join(', ')}`;

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

      let employee: any = undefined;
      let standType: any = undefined;

      if (employeeId) {
        employee = await this.employeeService.findById(employeeId);
        if (!employee) throw new NotFoundException('Сотрудник не найден');
      }

      if (standTypeId) {
        standType = await this.standTypeService.findOne(standTypeId);
        if (!standType) throw new NotFoundException('Тип стенда не найден');
      }

      const entity = this.repo.create({
        ...defaultData,
        employees: employee,
        standType: standType,
      } as DeepPartial<Stands>);

      const savedEntity = await this.repo.save(entity);

      // Отправляем уведомление об успешном создании
      const recordType = isStand ? 'стенд' : 'категорию стендов';
      const message = `Успешно создан ${recordType}: "${savedEntity.title}"`;
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

  private isStandData(data: any): boolean {
    return !!(
      data.image ||
      data.width ||
      data.height ||
      data.thickness ||
      data.weightNetto ||
      data.weightBrutto ||
      data.link ||
      data.vendorCode ||
      data.manufactureTime ||
      data.comment
    );
  }

  // Валидация обязательных полей для стенда
  private validateStandFields(
    data: any,
    employeeId?: number,
    standTypeId?: number,
  ): string[] {
    const missingFields: string[] = [];

    // Обязательные поля для стенда
    const requiredFields = [
      { field: 'image', name: 'Изображение' },
      { field: 'width', name: 'Ширина' },
      { field: 'height', name: 'Высота' },
      { field: 'thickness', name: 'Толщина' },
      { field: 'weightNetto', name: 'Вес нетто' },
      { field: 'weightBrutto', name: 'Вес брутто' },
      { field: 'link', name: 'Ссылка' },
      { field: 'vendorCode', name: 'Артикул' },
      { field: 'manufactureTime', name: 'Время изготовления' },
      { field: 'comment', name: 'Комментарий' },
    ];

    // Проверяем каждое обязательное поле
    for (const { field, name } of requiredFields) {
      if (!data[field] || data[field] === '' || data[field] === null) {
        missingFields.push(name);
      }
    }

    // Проверяем employeeId
    if (!employeeId) {
      missingFields.push('Сотрудник');
    }

    // Проверяем standTypeId
    if (!standTypeId) {
      missingFields.push('Тип стенда');
    }

    return missingFields;
  }

  async findAll() {
    return await this.repo.find({
      relations: [
        'standType',
        'employees',
        'employees.peoples',
        'parent',
        'children',
      ],
    });
  }

  async findCategories(): Promise<Stands[]> {
    const allItems = await this.findAll();
    return allItems.filter((item) => item.isCategory());
  }

  async findStands(): Promise<Stands[]> {
    const allItems = await this.findAll();
    return allItems.filter((item) => item.isStand());
  }

  async findByParent(parentId: number | null): Promise<Stands[]> {
    return await this.repo.find({
      where: { parentId: parentId ?? IsNull() },
      relations: [
        'standType',
        'employees',
        'employees.peoples',
        'parent',
        'children',
      ],
    });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['standType', 'employees', 'employees.peoples'],
    });
  }

  async generateData() {
    try {
      const stands = await this.findAll();
      const data: any[] = [];

      if (!stands) throw new Error('Ошибка при поиске стендов!');

      stands.map((item) => {
        const { parentId, standType, employees, ...defaultData } = item;
        const standTypeTitle = standType?.title;

        const emp = employees?.peoples;
        const employeeName = emp
          ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
          : '';

        data.push({
          ...defaultData,
          standTypeTitle,
          employeeName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<Stands>) {
    return await this.repo.update(id, data);
  }

  async getParents() {
    const stands = await this.repo.find({
      relations: ['standType', 'employees'],
    });
    console.log('stands', stands);

    // Фильтруем стенды, у которых parentId === null
    const parentStands = stands.filter((stand) => stand?.parentId === null);

    console.log('parentStands', parentStands);
    return parentStands;
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

  async getTree() {
    const [standTypes, allItems] = await Promise.all([
      this.repo.manager.getRepository(StandsTypes).find(),
      this.repo.find({
        relations: [
          'standType',
          'employees',
          'employees.peoples',
          'parent',
          'children',
        ],
      }),
    ]);

    const categories = allItems.filter((item) => item.isCategory());
    const stands = allItems.filter((item) => item.isStand());

    const buildCategoryTree = (parentId: number | null = null): any[] => {
      return categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          id: cat.id,
          name: cat.title,
          nodeType: 'stands_categories',
          isCategory: true,
          children: [
            ...buildCategoryTree(cat.id),
            ...stands
              .filter((stand) => stand.parentId === cat.id)
              .map((stand) => {
                const emp = stand.employees?.peoples;
                const employeeName = emp
                  ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
                  : '';
                const suffix = employeeName
                  ? ` | Сотрудник: ${employeeName}`
                  : '';
                return {
                  name: `${stand.title}${suffix}`,
                  nodeType: 'stands',
                  ...stand,
                  children: [],
                };
              }),
          ],
        }));
    };

    // Строим дерево с типами стендов как корнем
    const tree = (standTypes || []).map((standType: any) => ({
      id: standType.id,
      name: standType.title,
      nodeType: 'stands_types',
      children: [
        // Добавляем категории стендов (parentId == null)
        ...buildCategoryTree(null),
        // Добавляем стенды без категорий (parentId == null, но заполнены дополнительные поля)
        ...stands
          .filter((stand) => stand.parentId === null)
          .map((stand) => {
            const emp = stand.employees?.peoples;
            const employeeName = emp
              ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
              : '';
            const suffix = employeeName ? ` | Сотрудник: ${employeeName}` : '';
            return {
              name: `${stand.title}${suffix}`,
              nodeType: 'stands',
              ...stand,
              children: [],
            };
          }),
      ],
    }));

    return { name: 'Стенды', children: tree };
  }

  async getTreeWithParent() {
    try {
      const [types, stands] = await Promise.all([
        this.repo.manager.getRepository(StandsTypes).find(),
        this.repo.find({
          relations: ['standType', 'employees', 'employees.peoples'],
          order: { parentId: 'ASC', id: 'ASC' },
        }),
      ]);

      // Создаем карту стендов для быстрого доступа
      const standsMap = new Map<number, any>();
      const rootStands: any[] = [];

      // Подготавливаем все узлы стендов
      stands.forEach((stand) => {
        const emp = stand.employees?.peoples;
        const employeeName = emp
          ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
          : '';
        const suffix = employeeName ? ` | Сотрудник: ${employeeName}` : '';

        const standNode = {
          id: stand.id,
          name: `${stand.title}${suffix}`,
          nodeType: 'stands',
          parentId: stand.parentId,
          standTypeId: stand.standType?.id,
          children: [],
        };

        standsMap.set(stand.id, standNode);

        if (!stand.parentId) {
          rootStands.push(standNode);
        }
      });

      // Строим дерево, добавляя детей к родителям
      stands.forEach((stand) => {
        if (stand.parentId) {
          const parent = standsMap.get(stand.parentId);
          if (parent) {
            parent.children.push(standsMap.get(stand.id));
          } else {
            // Если родитель не найден, добавляем в корень
            rootStands.push(standsMap.get(stand.id));
          }
        }
      });

      // Группируем по типам стендов
      const tree = (types || []).map((type: any) => ({
        id: type.id,
        name: type.title,
        nodeType: 'stands_types',
        children: rootStands
          .filter((stand) => stand.standTypeId === type.id)
          .map((stand) => ({
            id: stand.id,
            name: stand.name,
            nodeType: stand.nodeType,
            parentId: stand.parentId,
            children: stand.children,
          })),
      }));

      // Фильтруем типы, у которых есть стенды
      const filteredTree = tree.filter((type) => type.children.length > 0);

      return {
        name: 'Стенды',
        nodeType: 'root',
        children: filteredTree,
      };
    } catch (e) {
      throw new Error(e as any);
    }
  }

  /**
   * Метод работает только на Web-версии!
   * Не удалять!
   * @returns
   */
  async getTreeForWeb() {
    try {
      const [types, stands] = await Promise.all([
        this.repo.manager.getRepository(StandsTypes).find(),
        this.repo.find({
          relations: ['standType', 'employees', 'employees.peoples'],
        }),
      ]);

      // вспомогательная функция для построения иерархии по parentId
      const buildStandTree = (
        standsList: any[],
        parentId: number | null = null,
      ) => {
        return standsList
          .filter((s) => s.parentId === parentId)
          .map((s) => {
            const emp = s.employees?.peoples;
            const employeeName = emp
              ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
              : '';
            const suffix = employeeName ? ` | Сотрудник: ${employeeName}` : '';

            return {
              id: s.id,
              name: `${s.title}${suffix}`,
              nodeType: 'stands',
              children: buildStandTree(standsList, s.id), // рекурсия
            };
          });
      };

      const tree = (types || []).map((t: any) => ({
        id: t.id,
        name: t.title,
        nodeType: 'stands_types',
        children: buildStandTree(
          (stands || []).filter(
            (s) => s.standType && (s.standType as any).id === t.id,
          ),
        ),
      }));

      return { name: 'Стенды', children: tree };
    } catch (e) {
      throw new Error(e as any);
    }
  }
}
