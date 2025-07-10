import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/UserRegisterDTO';
import * as bcrypt from 'bcrypt';
import { PeoplesService } from 'src/peoples/peoples.service';
import { EmployeesService } from 'src/employees/employees.service';
import { Employees } from 'src/employees/employees.entity';
import { EmployeesProfessionsService } from 'src/employees_professions/employees_professions.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
    private employeesService: EmployeesService,
    private employeeProfessionService: EmployeesProfessionsService,
  ) {}

  async findByUsername(userName: string) {
    return this.usersRepository.findOne({
      where: { userName },
      relations: ['employees'],
    });
  }

  async create(data: UserRegisterDTO) {
    try {
      data.passwordSalt = (
        await this.cryptUserPasswordService(data.password)
      ).toString();

      const employee = await this.employeesRepository.findOne({
        where: { id: data.employeeId },
      });

      if (!employee) throw new Error('Employee not found!');

      const newUser = this.usersRepository.create({
        userName: data.userName,
        password: data.password,
        passwordSalt: data.passwordSalt,
        employees: employee,
      });
      const savedUser = await this.usersRepository.save(newUser);

      // try {
      //   await this.employeesService.assignDefaultProfession(people.id);
      // } catch (error) {
      //   console.error('Ошибка при создании сотрудника:', error);
      // }

      return savedUser;
    } catch (e) {
      console.error('Ошибка при регистрации:', e);
      throw new BadRequestException(
        'Ошибка при регистрации пользователя: ' + e.message,
      );
    }
  }

  async getUserWithProfessionTitle(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['employees', 'employees.peoples'],
    });
    if (!user) return null;

    const employeeId = user.employees?.id;
    console.log('employeeId', employeeId);

    if (!employeeId) throw new NotFoundException('EmployeeId не найден');

    const employeeProfession =
      await this.employeeProfessionService.findEmployeeProfessionByEmployeeId(
        employeeId,
      );

    console.log('!!!!!!!!!!!!!!employeeProfession', employeeProfession);

    return {
      ...user,
      employeeProfession,
    };
  }

  async getUserById(id: number) {
    return await this.getUserWithProfessionTitle(id);
  }

  async cryptUserPasswordService(password: string) {
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(password, salt);
  }

  async getUsers() {
    try {
      return await this.usersRepository.find({
        relations: ['employees', 'employees.peoples'],
      });
    } catch (e) {
      console.error(e);
    }
  }

  async generateData() {
    try {
      const users = await this.getUsers();
      const data: any[] = [];

      users?.map((user) => {
        const { employees, ...defaultData } = user;
        const fullname = `${employees?.peoples?.firstName} ${employees?.peoples?.middleName} ${employees?.peoples?.lastName}`;

        data.push({
          id: user.id,
          userName: user.userName,
          employees: fullname,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: any, updateUser: UserRegisterDTO) {
    try {
      await this.usersRepository.update(id, updateUser);
    } catch (e) {
      console.error(e);
    }
  }

  // backend/src/user/user.service.ts
  async deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }
}
