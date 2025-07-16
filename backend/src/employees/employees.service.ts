import {
  ForbiddenException,
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
  ) {}

  async create(data: EmployeesDTO) {
    const people = await this.peoplesRepository.findOne({
      where: { id: data.peopleId },
    });

    if (!people) throw new Error('Target people not found');

    const employee = this.employeesRepository.create({
      dismissalDate: data.dismissalDate,
      peoples: people,
    } as Partial<Employees>);
    return await this.employeesRepository.save(employee);
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

    Object.assign(employee, data, { peoples: people });
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
    return await this.employeesRepository.delete(id);
  }

  async getEmployeesTree() {
    const employeeDepartments = await this.employeeDepartmentsService.findAll();
    const depMap = new Map();

    for (const ed of employeeDepartments) {
      const depName = ed.departments?.title || 'Без названия';

      if (!depMap.has(depName)) depMap.set(depName, []);

      const people = ed.employees?.peoples;

      const fio = people
        ? `${people.lastName} ${people.firstName} ${people.middleName}`
        : 'Без ФИО';

      depMap.get(depName).push({
        name: [
          `${fio}`,
          `Дата приема: ${ed.employees?.hiringDate}`,
          ed.employees?.dismissalDate
            ? `Дата увольнения: ${ed.employees?.dismissalDate}`
            : '',
        ]
          .filter(Boolean)
          .join(' | '),
        nodeType: 'employees',
        employees: fio,
        birthDate: ed.employees?.peoples?.birthDate,
        ...ed.employees,
        peoples: ed.employees?.peoples,
      });
    }

    const result: any = {};
    result.name = 'Сотрудники';
    result.children = [];

    for (const [depName, employees] of depMap.entries()) {
      result.children.push({
        name: depName,
        nodeType: 'departments',
        children: employees,
      });
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
