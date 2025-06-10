import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/UserRegisterDTO';
import * as bcrypt from 'bcrypt';
import { PeoplesService } from 'src/peoples/peoples.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private peoplesService: PeoplesService,
  ) {}

  async findByUsername(userName: string) {
    return this.usersRepository.findOne({
      where: { userName },
    });
  }

  async create(data: UserRegisterDTO) {
    try {
      data.passwordSalt = (
        await this.cryptUserPasswordService(data.password)
      ).toString();

      const peopleData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        phone: data.phone,
        comment: data.comment,
      };

      const people = await this.peoplesService.create(peopleData);

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

      return this.usersRepository.save(newUser);
    } catch (e) {
      console.error(e);
    }
  }

  async getUserById(id: number) {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: ['peoples'],
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
