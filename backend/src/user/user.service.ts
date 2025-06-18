import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/UserRegisterDTO';
import * as bcrypt from 'bcrypt';
import { PeoplesService } from 'src/peoples/peoples.service';
import { EmployeesService } from 'src/employees/employees.service';
import { ProfessionsService } from 'src/professions/professions.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private peoplesService: PeoplesService,
    private employeesService: EmployeesService,
    private professionsService: ProfessionsService,
  ) {}

  async findByUsername(userName: string) {
    return this.usersRepository.findOne({
      where: { userName },
      relations: ['profession', 'peoples'],
    });
  }

  async create(data: UserRegisterDTO) {
    try {
      data.passwordSalt = (
        await this.cryptUserPasswordService(data.password)
      ).toString();

      // Проверяем, если человек уже существует в базе - записываем его в people
      let people = await this.peoplesService.findById(data.peopleId);

      // если не существует, то создаем нового (актуально при регистрации)
      if (!people) {
        const peopleData = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          phone: data.phone,
          comment: data.comment,
        };

        people = await this.peoplesService.create(peopleData);
      }

      const itProfession =
        await this.professionsService.findByTitle('IT-специалист');
      if (!itProfession) {
        throw new BadRequestException('Профессия IT-специалист не найдена');
      }

      const user = {
        userName: data.userName,
        password: data.password,
        passwordSalt: data.passwordSalt,
        peoples: people,
        profession: itProfession,
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

  async getUserById(id: number) {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: ['peoples', 'profession'],
    });
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
