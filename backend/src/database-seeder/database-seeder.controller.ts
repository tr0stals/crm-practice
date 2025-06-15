import { Controller, Post } from '@nestjs/common';
import { DatabaseSeederService } from './database-seeder.service';

@Controller('database-seeder')
export class DatabaseSeederController {
  constructor(private readonly seederService: DatabaseSeederService) {}

  @Post('seed')
  async seedDatabase() {
    await this.seederService.seed();
    return { message: 'База данных успешно заполнена тестовыми данными' };
  }
} 