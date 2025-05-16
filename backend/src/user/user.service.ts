import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const existing = await this.findByEmail(user.email!);
    if (existing) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
} 