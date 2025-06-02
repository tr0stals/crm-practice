import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/UserRegisterDTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.roles'],
    });
  }

  async create(user: UserRegisterDTO) {
    try {
      const existing = await this.findByEmail(user.email);

      user.passwordSalt = (
        await this.cryptUserPasswordService(user.password)
      ).toString();

      if (existing) {
        throw new BadRequestException(
          'Пользователь с таким email уже существует',
        );
      }
      const newUser = this.usersRepository.create(user);
      return this.usersRepository.save(newUser);
    } catch (e) {
      console.error(e);
    }
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
