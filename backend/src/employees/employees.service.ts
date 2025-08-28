import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeesDTO } from './dto/EmployeesDTO';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';
import { User } from 'src/user/user.entity';
import { EmployeeDepartmentsService } from 'src/employee_departments/employee_departments.service';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { Departments } from 'src/departments/departments.entity';
import { EmployeeDepartments } from 'src/employee_departments/employee_departments.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
    @InjectRepository(Peoples)
    private peoplesRepository: Repository<Peoples>,
    @InjectRepository(Professions)
    private professionsRepository: Repository<Professions>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private employeeDepartmentsService: EmployeeDepartmentsService,
    @InjectRepository(EmployeesProfessions)
    private employeesProfessionsRepository: Repository<EmployeesProfessions>,
    @InjectRepository(Organizations)
    private organizationsRepo: Repository<Organizations>,
    @InjectRepository(Departments)
    private departmentsRepo: Repository<Departments>,
  ) {}

  private normalizeDate(v: any): Date | null {
    if (v === undefined || v === null) return null;
    if (typeof v === 'string') {
      const s = v.trim();
      if (!s) return null;
      // ожидаем yyyy-MM-dd
      const parts = s.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(Date.UTC(year, month, day));
        return isNaN(d.getTime()) ? null : (d as unknown as Date);
      }
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    if (v instanceof Date) return v;
    return null;
  }

  async create(data: EmployeesDTO) {
    const people = await this.peoplesRepository.findOne({
      where: { id: data.peopleId },
    });

    if (!people) throw new Error('Target people not found');

    const employee = this.employeesRepository.create({
      hiringDate: this.normalizeDate((data as any).hiringDate),
      dismissalDate: this.normalizeDate((data as any).dismissalDate),
      peoples: people,
    } as Partial<Employees>);
    return await this.employeesRepository.save(employee);
  }

  /**
   * Поиск уволенных сотрудников
   * @returns Employees[]
   */
  async getDismissalEmployees() {
    try {
      const dismissialEmployees = await this.employeesRepository.find({
        relations: ['peoples'],
      });

      if (!dismissialEmployees || dismissialEmployees.length === 0)
        throw new NotFoundException('Не найдены уволенные сотрудники');

      return dismissialEmployees.filter((item) => item.dismissalDate !== null);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAll() {
    return await this.employeesRepository.find({
      relations: [
        'peoples',
        'employeeDepartments',
        'employeeDepartments.departments',
      ],
    });
  }

  async generateData() {
    const data = await this.getAll();

    return data.map((item: any) => {
      const peoples = item.peoples;
      const fullname = [
        peoples?.lastName,
        peoples?.firstName,
        peoples?.middleName,
      ]
        .filter(Boolean)
        .join(' ');

      const departmentTitles =
        item.employeeDepartments?.map((dep: any) => dep.departments?.title) ||
        [];

      return {
        id: item.id,
        dismissalDate: item.dismissalDate,
        fullname: fullname,
        departmentTitle: departmentTitles.join(', '), // если нужно все департаменты через запятую
        // Если только первый: departmentTitle: departmentTitles[0] || ''
      };
    });
  }

  async update(id: number, data: EmployeesDTO) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) return null;

    console.log('data.peopleId type:', typeof data.peoples?.id);

    const people = await this.peoplesRepository.findOne({
      where: { id: data.peoples?.id },
    });

    const patch: any = { ...data, peoples: people };
    if ('hiringDate' in (data as any))
      patch.hiringDate = this.normalizeDate((data as any).hiringDate);
    if ('dismissalDate' in (data as any))
      patch.dismissalDate = this.normalizeDate((data as any).dismissalDate);
    Object.assign(employee, patch);
    return await this.employeesRepository.save(employee);
  }

  async findById(incomingId: number) {
    try {
      return await this.employeesRepository.findOne({
        where: { id: incomingId },
        relations: ['peoples'],
      });
    } catch (e) {
      throw new Error('Не удалось найти сотрудника по ID');
    }
  }

  async findWithProfession(incomingId: number) {
    try {
      const employee = await this.employeesRepository.findOneBy({
        id: incomingId,
      });

      return await this.employeesProfessionsRepository.find({
        where: { employees: { id: employee?.id } },
        relations: ['professions'],
      });
    } catch (e) {
      throw new Error(`Failed to find employee professions: ${e.message}`);
    }
  }

  async delete(id: number) {
    try {
      await this.employeesRepository.delete(id);
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

  /**
   * Не удалять - метод работает на фронте
   * @returns
   */
  async getEmployeesTree() {
    try {
      const departments = await this.departmentsRepo.find();
      const employeeDepartments =
        await this.employeeDepartmentsService.findAll();

      const employeeProfessions =
        await this.employeesProfessionsRepository.find({
          relations: ['employees', 'professions'],
        });

      const dismissalEmployees = await this.getDismissalEmployees();

      if (!dismissalEmployees)
        throw new NotFoundException('Не найдены уволенные сотрудники');

      if (!employeeDepartments)
        throw new NotFoundException('Не найдены employeeDepartments');

      // Инициализируем узлы для всех отделов (пустые тоже попадут в карту)
      const depMap = new Map<
        number,
        { id: number; name: string; nodeType: string; children: any[] }
      >();

      for (const dep of departments) {
        depMap.set(dep.id, {
          id: dep.id,
          name: dep.title || 'Без названия',
          nodeType: 'departments',
          children: [],
        });
      }

      // Заполняем сотрудниками
      for (const depRel of employeeDepartments) {
        const depId = depRel.departments?.id;
        if (!depId) continue;

        const employee = depRel.employees;
        if (employee) {
          // Проверяем, не уволен ли сотрудник
          if (dismissalEmployees.some((e) => e.id === employee.id)) continue;

          const professions = employeeProfessions
            ?.filter((item) => item.employees?.id === employee.id)
            ?.map((item: EmployeesProfessions) => item.professions?.title)
            ?.filter(Boolean);

          const node = depMap.get(depId);
          if (!node) continue;

          console.log(professions);

          node.children.push({
            id: employee.id,
            name: `${employee.peoples?.lastName} ${employee.peoples?.firstName} ${employee.peoples?.middleName} | ${employee.peoples?.phone} | ${professions}`,
            nodeType: 'employees',
          });
        }
      }

      // Формируем итоговую структуру
      const result: any = { name: 'Сотрудники', children: [] };
      for (const [, depNode] of depMap.entries()) {
        result.children.push(depNode);
      }

      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getTree() {
    // Загружаем все отделы, чтобы отобразить даже пустые
    const allDepartments = await this.departmentsRepo.find();
    const employeeDepartments = await this.employeeDepartmentsService.findAll();

    // depId -> { id, name, nodeType, children: [] }
    const depMap = new Map<
      number,
      { id: number; name: string; nodeType: string; children: any[] }
    >();

    // Инициализируем узлы для всех отделов
    for (const dep of allDepartments) {
      depMap.set(dep.id, {
        id: dep.id,
        name: dep.title || 'Без названия',
        nodeType: 'departments',
        children: [],
      });
    }

    // Заполняем сотрудниками связи employee_departments
    for (const ed of employeeDepartments) {
      const depId = ed.departments?.id;
      if (!depId) continue;
      const employee = ed.employees;
      // В основном дереве не показываем уволенных
      if (employee?.dismissalDate) continue;

      const people = employee?.peoples;
      const fio = people
        ? `${people.lastName} ${people.firstName} ${people.middleName}`
        : 'Без ФИО';

      const node = depMap.get(depId);
      if (!node) continue;

      node.children.push({
        name: [
          `${fio}`,
          employee?.hiringDate ? `Дата приема: ${employee.hiringDate}` : '',
        ]
          .filter(Boolean)
          .join(' | '),
        nodeType: 'employees',
        employees: fio,
        birthDate: employee?.peoples?.birthDate,
        departmentId: depId,
        ...employee,
        peoples: employee?.peoples,
      });
    }

    const result: any = { name: 'Сотрудники', children: [] };
    for (const [, depNode] of depMap.entries()) {
      result.children.push({
        name: depNode.name,
        nodeType: 'departments',
        id: depNode.id,
        children: depNode.children,
      });
    }
    return result;
  }

  async getTreeDismissed() {
    // Показываем только уволенных сотрудников, сгруппированных по отделам
    const allDepartments = await this.departmentsRepo.find();
    const employeeDepartments = await this.employeeDepartmentsService.findAll();

    const depMap = new Map<
      number,
      { id: number; name: string; nodeType: string; children: any[] }
    >();
    for (const dep of allDepartments) {
      depMap.set(dep.id, {
        id: dep.id,
        name: dep.title || 'Без названия',
        nodeType: 'departments',
        children: [],
      });
    }

    for (const ed of employeeDepartments) {
      const depId = ed.departments?.id;
      if (!depId) continue;
      const employee = ed.employees;
      // Берём только уволенных
      if (!employee?.dismissalDate) continue;

      const people = employee.peoples;
      const fio = people
        ? `${people.lastName} ${people.firstName} ${people.middleName}`
        : 'Без ФИО';

      const node = depMap.get(depId);
      if (!node) continue;

      node.children.push({
        name: [
          `${fio}`,
          employee.hiringDate ? `Дата приема: ${employee.hiringDate}` : '',
          employee.dismissalDate
            ? `Дата увольнения: ${employee.dismissalDate}`
            : '',
        ]
          .filter(Boolean)
          .join(' | '),
        nodeType: 'employees',
        employees: fio,
        birthDate: employee?.peoples?.birthDate,
        departmentId: depId,
        ...employee,
        peoples: employee?.peoples,
      });
    }

    const result: any = { name: 'Уволенные сотрудники', children: [] };
    for (const [, depNode] of depMap.entries()) {
      // Добавляем только отделы, где есть уволенные дети, чтобы не засорять пустыми
      if (depNode.children.length > 0) {
        result.children.push({
          name: depNode.name,
          nodeType: 'departments',
          id: depNode.id,
          children: depNode.children,
        });
      }
    }
    return result;
  }

  /**
   * 1. Считаю, что метод assignDefaultProfession - не нужен. Так как мы добавляем сотрудника от лица админа.
   *    Иначе может случиться ошибка/баг.
   *
   * 2. Вынес методы changeEmployeeProfession и getEmployeeWithProfession в EmployeesProfessionsService.
   */

  // async assignDefaultProfession(peopleId: number) {
  //   const people = await this.peoplesRepository.findOne({
  //     where: { id: peopleId },
  //     relations: ['employees'],
  //   });

  //   if (!people) {
  //     throw new NotFoundException(`Человек с ID ${peopleId} не найден`);
  //   }

  //   // Проверяем, есть ли уже сотрудник с этим peopleId
  //   if (people.employees && people.employees.length > 0) {
  //     throw new ForbiddenException('Сотрудник с таким ID уже существует');
  //   }

  //   // Находим профессию IT-специалист
  //   const itProfession = await this.professionsRepository.findOne({
  //     where: { title: 'IT-специалист' },
  //   });

  //   if (!itProfession) {
  //     throw new NotFoundException('Профессия IT-специалист не найдена');
  //   }

  //   // Создаем нового сотрудника
  //   const employee = this.employeesRepository.create({
  //     birthDate: new Date(), // Можно сделать поле опциональным или добавить в DTO
  //     peoples: people,
  //     profession: itProfession,
  //   } as Partial<Employees>);

  //   return await this.employeesRepository.save(employee);
  // }

  // async changeEmployeeProfession(employeeId: number, newProfessionId: number) {
  //   // Проверяем существование сотрудника
  //   const employee = await this.employeesRepository.findOne({
  //     where: { id: employeeId },
  //     relations: ['profession', 'peoples'],
  //   });

  //   // Проверяем права доступа (только администратор или HR может менять профессии)
  //   const allowedProfessions = ['Администратор', 'HR-специалист'];
  //   const employeeProfession = await this.professionsRepository.findOne({
  //     where: { id: employee?.profession.id },
  //   });

  //   if (
  //     !employeeProfession ||
  //     !allowedProfessions.includes(employeeProfession.title)
  //   ) {
  //     throw new ForbiddenException(
  //       'У вас нет прав для изменения профессий сотрудников',
  //     );
  //   }

  //   if (!employee) {
  //     throw new NotFoundException(`Сотрудник с ID ${employeeId} не найден`);
  //   }

  //   // Проверяем существование новой профессии
  //   const newProfession = await this.professionsRepository.findOne({
  //     where: { id: newProfessionId },
  //   });

  //   if (!newProfession) {
  //     throw new NotFoundException(
  //       `Профессия с ID ${newProfessionId} не найдена`,
  //     );
  //   }

  //   // Обновляем профессию
  //   employee.profession = newProfession;
  //   return await this.employeesRepository.save(employee);
  // }

  // async getEmployeeWithProfession(id: number) {
  //   const employee = await this.employeesRepository.findOne({
  //     where: { id },
  //     relations: ['profession', 'peoples'],
  //   });

  //   return employee;
  // }

  //   if (!employee) {
  //     throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
  //   }

  //   return employee;
  // }
}
