import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from 'src/employees/employees.entity';
import { Professions } from 'src/professions/professions.entity';
import { DeepPartial, Repository } from 'typeorm';
import { AssignProfessionDTO } from './dto/AssignProfessionDTO';
import { EmployeesProfessions } from './employees_professions.entity';
import { EmployeesProfessionsDTO } from './dto/EmployeesProfessionsDTO';

@Injectable()
export class EmployeesProfessionsService {
  constructor(
    @InjectRepository(EmployeesProfessions)
    private employeesProfessionsRepository: Repository<EmployeesProfessions>,
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
    @InjectRepository(Professions)
    private professionRepository: Repository<Professions>,
  ) {}

  async assignProfession(data: AssignProfessionDTO) {
    const employee = await this.employeesRepository.findOne({
      where: { id: data.employeeId },
    });

    /**
     * Если передается professionId - тогда ищем профессию по ID.
     * Если нет - задаем дефолтную профессию - Директор
     */
    const profession = data.professionId
      ? await this.professionRepository.findOne({ where: { id: data.professionId } })
      : await this.professionRepository.findOne({ where: { title: 'Директор' } });

    console.log('!!!!1', profession);

    if (!profession) throw new NotFoundException('Profession not found');
    if (!employee) throw new NotFoundException('Employee not found');

    const entity = this.employeesProfessionsRepository.create({
      employees: employee,
      professions: profession,
    });
    console.log('!!!!!2', entity);

    return await this.employeesProfessionsRepository.save(entity);
  }

  async findEmployeeProfessionByEmployeeId(employeeId: number) {
    console.log('employeeId', employeeId);
    const data = await this.employeesProfessionsRepository.findOne({
      where: { employees: { id: employeeId } },
      relations: [
        'employees',
        'employees.peoples',
        'professions',
      ],
    });
    console.log('data!!!!!!', data);

    return data;
  }

  async getDataForAdditional() {
    try {
      const employees = await this.employeesRepository.find({
        relations: ['peoples'],
      });

      const professions = await this.professionRepository.find();

      return {
        employees: employees,
        professions,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const employeeProfessions = await this.getAll();
      const data: any[] = [];

      if (!employeeProfessions)
        throw new NotFoundException('Ошибка при поиске профессий сотрудников');

      employeeProfessions.map((item) => {
        const { employees, professions, ...defaultData } = item;
        console.log('employees', employees);
        const peoples = employees?.peoples;

        const fullname = [
          peoples?.firstName,
          peoples?.middleName,
          peoples?.lastName,
        ]
          .filter(Boolean)
          .join(' ');

        const professionTitle = professions?.title;
        console.debug(professionTitle);

        data.push({
          ...defaultData,
          fullname,
          professionTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: EmployeesProfessionsDTO) {
    const employee = await this.employeesRepository.findOne({
      where: {
        id: data.employeeId,
      },
      relations: ['peoples'],
    });

    const profession = await this.professionRepository.findOne({
      where: { id: data.professionId },
    });

    const entity = this.employeesProfessionsRepository.create({
      employees: employee,
      professions: profession,
    } as DeepPartial<EmployeesProfessions>);

    return await this.employeesProfessionsRepository.save(entity);
  }

  async getAll() {
    return await this.employeesProfessionsRepository.find({
      relations: [
        'employees',
        'employees.peoples',
        'professions',
      ],
    });
  }

  async getOne(id: number) {
    return await this.employeesProfessionsRepository.findOne({
      where: { id },
      relations: [
        'employees',
        'employees.peoples',
        'professions',
      ],
    });
  }

  async update(id: number, data: Partial<EmployeesProfessions>) {
    await this.employeesProfessionsRepository.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    try {
      await this.employeesProfessionsRepository.delete(id);
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

  // async changeEmployee(employeeId: number, newEmployeeId: number) {
  //   const employee = await this.employeesRepository.findOne({
  //     where: { id: employeeId },
  //   });

  //   if (!employee) throw new NotFoundException('Employee not found');

  //   Object.assign(employee, newEmployeeId);
  // }
}
