import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from 'src/employees/employees.entity';
import { Professions } from 'src/professions/professions.entity';
import { Repository } from 'typeorm';
import { AssignProfessionDTO } from './dto/AssignProfessionDTO';
import { EmployeesProfessions } from './employees-professions.entity';

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
    try {
      const employee = await this.employeesRepository.findOne({
        where: { id: data.employeeId },
      });

      /**
       * Если передается professionId - тогда ищем профессию по ID.
       * Если нет - задаем дефолтную профессию - Test
       */
      const profession = data.professionId
        ? await this.professionRepository.findOne({
            where: { id: data.professionId },
          })
        : await this.professionRepository.findOne({ where: { title: 'Test' } });

      if (!profession) throw new NotFoundException('Profession not found');
      if (!employee) throw new NotFoundException('Employee not found');

      const entity = this.employeesProfessionsRepository.create({
        employees: employee,
        professions: profession,
      });

      return await this.employeesProfessionsRepository.save(entity);
    } catch (e) {
      throw Error('Ошибка при назначении профессии', e);
    }
  }

  async findEmployeeProfessionByEmployeeId(employeeId: number) {
    try {
      return await this.employeesProfessionsRepository.findOne({
        where: { employees: { id: employeeId } },
        relations: ['employees', 'professions'],
      });
    } catch (e) {
      throw new Error('Ошибка при поиске EmployeeProfession', e);
    }
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

  // async changeEmployee(employeeId: number, newEmployeeId: number) {
  //   const employee = await this.employeesRepository.findOne({
  //     where: { id: employeeId },
  //   });

  //   if (!employee) throw new NotFoundException('Employee not found');

  //   Object.assign(employee, newEmployeeId);
  // }
}
