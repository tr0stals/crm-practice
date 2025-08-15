import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeDepartments } from 'src/employee_departments/employee_departments.entity';
import { EmployeeDepartmentsService } from 'src/employee_departments/employee_departments.service';
import { Employees } from 'src/employees/employees.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeUnitDTO } from './dto/CreateEmployeeUnitDTO';
import { Peoples } from 'src/peoples/peoples.entity';
import { PeoplesService } from 'src/peoples/peoples.service';
import { EmployeesProfessionsService } from 'src/employees_professions/employees_professions.service';
import { DatabaseService } from 'src/database/database.service';
import { Departments } from 'src/departments/departments.entity';
import { UpdateEmployeeUnitDTO } from './dto/UpdateEmployeeUnitDTO';
import { Professions } from 'src/professions/professions.entity';

@Injectable()
export class EmployeeUnitService {
  constructor(
    private readonly employeeService: EmployeesService,

    @InjectRepository(EmployeesProfessions)
    private readonly employeesProfessionsRepository: Repository<EmployeesProfessions>,

    @InjectRepository(EmployeeDepartments)
    private readonly employeeDepartmentsRepository: Repository<EmployeeDepartments>,

    private readonly employeeDepartmentsService: EmployeeDepartmentsService,

    private readonly employeeProfessionsService: EmployeesProfessionsService,

    private readonly databaseService: DatabaseService,

    @InjectRepository(Departments)
    private readonly departmentsRepository: Repository<Departments>,

    @InjectRepository(ProfessionRights)
    private readonly professionRightsRepository: Repository<ProfessionRights>,

    @InjectRepository(Peoples)
    private readonly peoplesRepository: Repository<Peoples>,
  ) {}

  /**
   * Генерация бизнес-сущности Сотрудники, в которой объединены несколько сущностей.
   * Для модальных окон редактирования/добавления
   */
  async getEmployeesUnit(employeeId: number) {
    try {
      const employee = await this.employeeService.findById(employeeId);

      const employeeProfessions =
        await this.employeesProfessionsRepository.find({
          relations: [
            'employees',
            'professionRights',
            'professionRights.professions',
          ],
        });

      const employeesDepartments =
        await this.employeeDepartmentsService.findAll();

      const employeeProfession = employeeProfessions.find((item) => {
        if (item.employees?.id === employee?.id) {
          return item.professionRights?.professions;
        }
      });

      const employeeDepartment = employeesDepartments.find((item) => {
        if (item.employees?.id === employee?.id) return item.departments;
      });

      if (!employeeDepartment)
        throw new NotFoundException('Не найдены отделы сотрудника');

      return {
        ...employee,
        departments: employeeDepartment,
        professions: employeeProfession,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  private async getDepartmentsMetaData() {
    const departments = await this.departmentsRepository.find();
    const professionRights = await this.professionRightsRepository.find({
      relations: ['rights', 'professions'],
    });
  }

  async getEmployeeUnitFormMetadata() {
    // Метаданные для основной таблицы employees
    const employeeMeta =
      await this.databaseService.getFormMetadata('employees');

    const peoples = await this.peoplesRepository.find();
    const peoplesMeta = {
      type: 'select',
      options: peoples.map((p) => ({
        id: p.id,
        label: `${p.lastName} ${p.firstName} ${p.middleName}`,
      })),
    };

    const employeesMeta = {
      hiringDate: {
        type: 'input',
      },
      dismissalDate: {
        type: 'input',
      },
      peoples: peoplesMeta,
    };

    // Метаданные для отделов
    const departments = await this.departmentsRepository.find();
    const departmentsMeta = {
      type: 'select',
      options: departments.map((d) => ({ id: d.id, label: d.title })),
    };

    // Метаданные для профессий
    const professionRights = await this.professionRightsRepository.find({
      relations: ['professions'],
    });
    // Убираем дубли, если одна профессия встречается несколько раз
    const professionsSet = new Map<number, string>();
    professionRights.forEach((pr) => {
      if (pr.professions?.id && pr.professions.title) {
        professionsSet.set(pr.professions.id, pr.professions.title);
      }
    });
    const professionsMeta = {
      type: 'select',
      options: Array.from(professionsSet, ([id, label]) => ({ id, label })),
    };

    return {
      ...employeesMeta,
      departments: departmentsMeta,
      professions: professionsMeta,
    };
  }

  async create(data: CreateEmployeeUnitDTO) {
    const { departments, professions, ...defaultData } = data;

    const people = await this.peoplesRepository.findOne({
      where: {
        id: data.peoples,
      },
    });

    const department = await this.departmentsRepository.findOne({
      where: {
        id: departments,
      },
    });

    const professionRight = await this.professionRightsRepository.findOne({
      where: {
        professions: { id: professions },
      },
      relations: ['professions', 'rights'],
    });

    if (!people) throw new NotFoundException('Ошибка при поиске человека');
    if (!department) throw new NotFoundException('Ошибка при поиске отдела');
    if (!professionRight)
      throw new NotFoundException('Ошибка при поиске профессии');

    const employee = await this.employeeService.create({
      hiringDate: data.hiringDate,
      dismissalDate: data.dismissalDate,
      peopleId: people?.id,
    });

    if (!employee) throw new Error('Ошибка при создании нового сотрудника');

    const employeeDepartment = await this.employeeDepartmentsService.create({
      departmentId: department.id,
      employeeId: employee.id,
    });

    const employeeProfession = await this.employeeProfessionsService.create({
      employeeId: employee.id,
      professionId: professionRight.id,
    });

    return {
      employee,
      employeeDepartment,
      employeeProfession,
    };
  }

  private async updateDepartments(employeeId: number, departmentId: number) {
    const targetEmployeeDepartment =
      await this.employeeDepartmentsRepository.findOne({
        where: { employees: { id: employeeId } },
        relations: ['employees', 'departments'],
      });

    if (!targetEmployeeDepartment)
      throw new NotFoundException('Не найдена запись targetEmployeeDepartment');

    const targetDepartment = await this.departmentsRepository.findOne({
      where: { id: departmentId },
    });

    if (!targetDepartment)
      throw new NotFoundException('Не найдена запись targetDepartment');

    // Обновляем связь
    targetEmployeeDepartment.departments = targetDepartment;

    // Сохраняем обновлённый объект
    return await this.employeeDepartmentsRepository.save(
      targetEmployeeDepartment,
    );
  }

  private async updateProfessions(employeeId: number, professionId: number) {
    try {
      const targetEmployeeProfession =
        await this.employeesProfessionsRepository.findOne({
          where: {
            employees: { id: employeeId },
          },
          relations: [
            'employees',
            'professionRights',
            'professionRights.professions',
          ],
        });

      if (!targetEmployeeProfession)
        throw new NotFoundException(
          'Не найдена запись targetEmployeeProfession',
        );

      const targetProfessionRights =
        await this.professionRightsRepository.findOne({
          where: {
            professions: { id: professionId },
          },
          relations: ['professions', 'rights'],
        });

      if (!targetProfessionRights)
        throw new NotFoundException('Не найдена запись targetProfessionRights');

      targetEmployeeProfession.professionRights = targetProfessionRights;

      return await this.employeesProfessionsRepository.save(
        targetEmployeeProfession,
      );
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, data: UpdateEmployeeUnitDTO) {
    try {
      const { departmentId, professionId, ...defaulData } = data;

      await this.employeeService.update(id, defaulData);
      await this.updateProfessions(id, professionId);
      await this.updateDepartments(id, departmentId);
    } catch (e) {
      throw e;
    }
  }
}
