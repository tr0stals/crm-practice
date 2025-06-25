import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeesDTO } from './dto/EmployeesDTO';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';
import { User } from 'src/user/user.entity';
import { EmployeeDepartmentsService } from 'src/employee-departments/employee-departments.service';

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
  ) {}

  async create(data: EmployeesDTO) {
    const people = await this.peoplesRepository.findOne({
      where: { id: data.peopleId },
    });
    const profession = await this.professionsRepository.findOne({
      where: { id: data.professionId },
    });
    const employee = this.employeesRepository.create({
      birthDate: data.birthDate,
      peoples: people,
      profession: profession,
    } as Partial<Employees>);
    return await this.employeesRepository.save(employee);
  }

  async getAll() {
    return await this.employeesRepository.find({
      relations: ['peoples', 'profession'],
    });
  }

  async update(id: number, data: EmployeesDTO) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) return null;
    const people = await this.peoplesRepository.findOne({
      where: { id: data.peopleId },
    });
    const profession = await this.professionsRepository.findOne({
      where: { id: data.professionId },
    });
    Object.assign(employee, data, { peoples: people, profession: profession });
    return await this.employeesRepository.save(employee);
  }

  async delete(id: number) {
    return await this.employeesRepository.delete(id);
  }

  async assignDefaultProfession(peopleId: number) {
    const people = await this.peoplesRepository.findOne({
      where: { id: peopleId },
      relations: ['employees'],
    });

    if (!people) {
      throw new NotFoundException(`Человек с ID ${peopleId} не найден`);
    }

    // Проверяем, есть ли уже сотрудник с этим peopleId
    if (people.employees && people.employees.length > 0) {
      throw new ForbiddenException('Сотрудник с таким ID уже существует');
    }

    // Находим профессию IT-специалист
    const itProfession = await this.professionsRepository.findOne({
      where: { title: 'IT-специалист' },
    });

    if (!itProfession) {
      throw new NotFoundException('Профессия IT-специалист не найдена');
    }

    // Создаем нового сотрудника
    const employee = this.employeesRepository.create({
      birthDate: new Date(), // Можно сделать поле опциональным или добавить в DTO
      peoples: people,
      profession: itProfession,
    } as Partial<Employees>);

    return await this.employeesRepository.save(employee);
  }

  async changeEmployeeProfession(employeeId: number, newProfessionId: number) {
    // Проверяем существование сотрудника
    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId },
      relations: ['profession', 'peoples'],
    });

    // Проверяем права доступа (только администратор или HR может менять профессии)
    const allowedProfessions = ['Администратор', 'HR-специалист'];
    const employeeProfession = await this.professionsRepository.findOne({
      where: { id: employee?.profession.id },
    });

    if (
      !employeeProfession ||
      !allowedProfessions.includes(employeeProfession.title)
    ) {
      throw new ForbiddenException(
        'У вас нет прав для изменения профессий сотрудников',
      );
    }

    if (!employee) {
      throw new NotFoundException(`Сотрудник с ID ${employeeId} не найден`);
    }

    // Проверяем существование новой профессии
    const newProfession = await this.professionsRepository.findOne({
      where: { id: newProfessionId },
    });

    if (!newProfession) {
      throw new NotFoundException(
        `Профессия с ID ${newProfessionId} не найдена`,
      );
    }

    // Обновляем профессию
    employee.profession = newProfession;
    return await this.employeesRepository.save(employee);
  }

  async getEmployeeWithProfession(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['profession', 'peoples', 'employeeStates'],
    });

    if (!employee) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    return employee;
  }

  async getEmployeesTree() {
    const employeeDepartments = await this.employeeDepartmentsService.findAll();
    const depMap = new Map();
    for (const ed of employeeDepartments) {
      const depName = ed.departments?.title || 'Без названия';
      if (!depMap.has(depName)) depMap.set(depName, []);
      const people = ed.employees?.peoples;
      const fio = people ? `${people.lastName} ${people.firstName} ${people.middleName}` : 'Без ФИО';
      depMap.get(depName).push({
        name: fio,
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
        children: employees,
      });
    }
    return result;
  }
}
