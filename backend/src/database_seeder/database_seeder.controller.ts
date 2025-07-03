import { Controller, Post } from '@nestjs/common';
import { DatabaseSeederService } from './database_seeder.service';

@Controller('database_seeder')
export class DatabaseSeederController {
  constructor(private readonly seederService: DatabaseSeederService) {}

  @Post('seed')
  async seedDatabase() {
    await this.seederService.seed();
    return { message: 'База данных успешно заполнена тестовыми данными' };
  }
} 