import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/UserRegisterDTO';
import * as bcrypt from 'bcrypt';
import { PeoplesService } from 'src/peoples/peoples.service';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private peoplesService: PeoplesService,
    private employeesService: EmployeesService,
  ) {}

  async findByUsername(userName: string) {
    return this.usersRepository.findOne({
      where: { userName },
      relations: ['peoples'],
    });
  }

  async create(data: UserRegisterDTO) {
    try {
      data.passwordSalt = (
        await this.cryptUserPasswordService(data.password)
      ).toString();

      const people = data.email
        ? await this.peoplesService.create({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            phone: data.phone,
            comment: data.comment,
          })
        : await this.peoplesService.findById(data.peopleId);

      if (!people) {
        throw new BadRequestException('Ошибка при регистрации пользователя');
      }

      const user = {
        userName: data.userName,
        password: data.password,
        passwordSalt: data.passwordSalt,
        peoples: people,
      };

      const newUser = this.usersRepository.create(user);
      const savedUser = await this.usersRepository.save(newUser);

      try {
        await this.employeesService.assignDefaultProfession(people.id);
      } catch (error) {
        console.error('Ошибка при создании сотрудника:', error);
      }

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
      relations: ['peoples', 'peoples.employees', 'peoples.employees.profession'],
    });
    if (!user) return null;
    const employee = user.peoples?.employees?.[0];
    const professionTitle = employee?.profession?.title || null;
    return {
      ...user,
      professionTitle,
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
      return await this.usersRepository.find();
    } catch (e) {
      console.error(e);
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
