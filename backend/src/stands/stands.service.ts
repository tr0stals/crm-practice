import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Stands } from './stands.entity';
import { StandsDTO } from './dto/StandsDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { StandTypesService } from 'src/stand_types/stand_types.service';
import { StandsTypes } from 'src/stand_types/stand_types.entity';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(Stands)
    private readonly repo: Repository<Stands>,
    private employeeService: EmployeesService,
    private standTypeService: StandTypesService,
  ) {}

  async create(data: StandsDTO) {
    try {
      const { employeeId, standTypeId, ...defaultData } = data;

      const employee = await this.employeeService.findById(employeeId);
      const standType = await this.standTypeService.findOne(standTypeId);

      if (!employee || !standType)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repo.create({
        ...defaultData,
        employees: employee,
        standType: standType,
      } as DeepPartial<Stands>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    return await this.repo.find({
      relations: ['standType', 'employees', 'employees.peoples'],
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

        if (!employees.peoples) throw new Error('Не найден сотрудник!');
        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;

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
    try {
      const [types, stands] = await Promise.all([
        this.repo.manager.getRepository(StandsTypes).find(),
        this.repo.find({
          relations: ['standType', 'employees', 'employees.peoples'],
        }),
      ]);

      const tree = (types || []).map((t: any) => ({
        id: t.id,
        name: t.title,
        nodeType: 'stands_types',
        children: (stands || [])
          .filter((s) => s.standType && (s.standType as any).id === t.id)
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
            };
          }),
      }));

      return { name: 'Стенды', children: tree };
    } catch (e) {
      throw new Error(e as any);
    }
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
}
