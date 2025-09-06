import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DatabaseEagerCachingService implements OnModuleInit {
  private cache: Record<string, any[]> = {};

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.refreshAll();
  }

  async refreshAll() {
    // Кэш из БД - categories удалены

    // Все таблицы из БД
    const tableNames = await this.databaseService.getTableNames();
    for (const name of tableNames) {
      this.cache[name] = await this.databaseService.getTableRows(name);
    }
  }

  getAll() {
    return this.cache;
  }

  getTable(name: string) {
    return this.cache[name] || [];
  }

  // Фоновое обновление (не блокирует поток)
  async refreshAllInBackground() {
    setTimeout(() => this.refreshAll(), 0);
  }
} 