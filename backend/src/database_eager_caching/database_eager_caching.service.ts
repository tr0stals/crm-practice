import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PcbsCategories } from 'src/pcbs_categories/pcbs_categories.entity';
import { ComponentsCategories } from 'src/components_categories/components_categories.entity';

@Injectable()
export class DatabaseEagerCachingService implements OnModuleInit {
  private cache: Record<string, any[]> = {};

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.refreshAll();
  }

  async refreshAll() {
    // Кэш из БД
    const [compCats, pcbCats] = await Promise.all([
      this.databaseService['dataSource']
        .getRepository(ComponentsCategories)
        .find({ relations: ['subcategories'] }),
      this.databaseService['dataSource']
        .getRepository(PcbsCategories)
        .find({ relations: ['subcategories'] }),
    ]);
    this.cache['component-categories'] = compCats;
    this.cache['pcb-categories'] = pcbCats;

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