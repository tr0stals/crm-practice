import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Stands } from './stands.entity';
import { StandsDTO } from './dto/StandsDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { StandTypesService } from 'src/stand_types/stand_types.service';

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

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
