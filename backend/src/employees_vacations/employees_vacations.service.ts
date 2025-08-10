import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { EmployeesVacations } from './employees_vacations.entity';
import { EmployeesVacationsDTO } from './dto/EmployeesVacationsDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class EmployeesVacationsService {
  constructor(
    @InjectRepository(EmployeesVacations)
    private repo: Repository<EmployeesVacations>,
    private employeeService: EmployeesService,
    private organizationService: OrganizationsService,
  ) {}

  async create(data: EmployeesVacationsDTO) {
    try {
      const { employeeId, factoryId, ...defaultData } = data;

      const employee = await this.employeeService.findById(employeeId);
      const factory = await this.organizationService.getById(factoryId);

      if (!employee) throw new Error('Не найден сотрудник');
      if (!employee) throw new Error('Не найдена организация');

      const entity = this.repo.create({
        ...defaultData,
        employees: employee,
        factory: factory,
      } as DeepPartial<EmployeesVacations>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAll() {
    return await this.repo.find({
      relations: ['employees', 'employees.peoples', 'factory'],
    });
  }

  async getOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['employees', 'employees.peoples', 'factory'],
    });
  }

  async generateData() {
    try {
      const employeeVacations = await this.getAll();
      const data: any[] = [];

      if (!employeeVacations)
        throw new NotFoundException('Ошибка поиска отпусков сотрудников');

      employeeVacations.map((item) => {
        const { employees, factory, ...defaultData } = item;

        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
        const factoryTitle = factory?.shortName;

        data.push({
          ...defaultData,
          factoryTitle,
          employeeName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<EmployeesVacations>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
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
