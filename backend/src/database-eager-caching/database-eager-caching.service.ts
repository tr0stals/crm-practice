import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PCB_CATEGORIES } from '../pcbs/pcbs-categories';
import { COMPONENT_CATEGORIES } from '../components/component-categories';

@Injectable()
export class DatabaseEagerCachingService implements OnModuleInit {
  private cache: Record<string, any[]> = {};

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.refreshAll();
  }

  async refreshAll() {
    // Статические справочники
    this.cache['component-categories'] = COMPONENT_CATEGORIES;
    this.cache['pcb-categories'] = PCB_CATEGORIES;

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