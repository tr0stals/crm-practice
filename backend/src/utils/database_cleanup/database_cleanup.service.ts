import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cron } from '@nestjs/schedule';

import { CLEANUP_ENTITIES_LIST } from './database_cleanup.config';
import { CleanupStatistics } from './database_cleanup.types';

@Injectable()
export class DatabaseCleanupService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseCleanupService.name);

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    console.log('[DATABASE_CLEANUP] Service initialized');
    this.logger.log('Database cleanup service initialized');
  }

  /**
   * Автоматический запуск очистки каждое 1 января в 00:00 ночи
   */
  @Cron('0 0 1 1 *', {
    name: 'annualDatabaseCleanup',
    // Запуск ровно в 00:00 1 января по локальному времени
  })
  async scheduleAnnualCleanup() {
    const now = new Date();
    console.log('[DATABASE_CLEANUP] 🚨 SCHEDULED CLEANUP TRIGGERED at:', now.toISOString());
    this.logger.log('🚨 STARTING ANNUAL DATABASE CLEANUP...');

    try {
      const result = await this.performCompleteReset();
      console.log('[DATABASE_CLEANUP] ✅ Annual cleanup completed. Cleaned tables:', result.cleanedTables.length);
      this.logger.log(`✅ Annual cleanup completed. Cleaned tables: ${result.cleanedTables.length}`);
    } catch (error) {
      console.error('[DATABASE_CLEANUP] ❌ Annual cleanup failed:', error.message);
      this.logger.error('❌ Annual cleanup failed:', error);
    }
  }

  /**
   * Универсальный метод для полной очистки всех таблиц из конфига
   * Используется для ежегодного сброса - удаляет ВСЕ записи без проверки дат
   */
  async performCompleteReset(): Promise<CleanupStatistics> {
    console.log('[DATABASE_CLEANUP] 🔄 Starting complete database reset...');
    this.logger.log('🔄 Starting complete database reset - deleting ALL records from configured tables');

    const resetStats: CleanupStatistics = {
      startTime: new Date(),
      endTime: new Date(),
      deletedRecords: 0,
      errors: [],
      cleanedTables: [],
    };

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Определяем порядок удаления: сначала дочерние таблицы, затем родительские
      const dependencyOrder = this.getTableDependencyOrder();

      console.log('[DATABASE_CLEANUP] 📋 Tables to reset:', dependencyOrder);

      for (const tableName of dependencyOrder) {
        try {
          console.log(`[DATABASE_CLEANUP] 🗑️  Truncating table: ${tableName}`);

          // Используем TRUNCATE для быстрой полной очистки с отключением проверок foreign keys
          await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);
          await queryRunner.query(`TRUNCATE TABLE \`${tableName}\``);
          await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);

          resetStats.cleanedTables.push(tableName);
          this.logger.log(`✅ Truncated table: ${tableName}`);

        } catch (truncateError) {
          // Если TRUNCATE не поддерживается, используем DELETE
          try {
            console.log(`[DATABASE_CLEANUP] 🔄 TRUNCATE failed for ${tableName}, using DELETE instead. Error: ${truncateError.message}`);

            const result = await queryRunner.query(`DELETE FROM \`${tableName}\``);
            const deletedCount = result.affectedRows || result.affected || 0;

            resetStats.deletedRecords += deletedCount;
            resetStats.cleanedTables.push(tableName);

            this.logger.log(`✅ Deleted all records from ${tableName}: ${deletedCount} records`);
          } catch (deleteError) {
            const errorMessage = `Failed to reset table ${tableName}: ${deleteError.message}`;
            console.error(`[DATABASE_CLEANUP] ❌ ${errorMessage}`);
            this.logger.error(errorMessage);
            resetStats.errors.push(errorMessage);
          }
        }
      }

      await queryRunner.commitTransaction();
      resetStats.endTime = new Date();

      // Логируем результаты
      const duration = resetStats.endTime.getTime() - resetStats.startTime.getTime();
      console.log(`[DATABASE_CLEANUP] ✅ Complete reset finished successfully`);
      console.log(`[DATABASE_CLEANUP] 📊 Tables cleaned: ${resetStats.cleanedTables.length}`);
      console.log(`[DATABASE_CLEANUP] 📋 Cleaned tables: ${resetStats.cleanedTables.join(', ')}`);
      console.log(`[DATABASE_CLEANUP] ⏱️  Duration: ${duration}ms`);
      console.log(`[DATABASE_CLEANUP] ❌ Errors: ${resetStats.errors.length}`);

      if (resetStats.errors.length > 0) {
        console.log(`[DATABASE_CLEANUP] 🚨 Errors: ${resetStats.errors.join('; ')}`);
      }

      this.logger.log(`Complete database reset completed successfully`);
      this.logger.log(`Tables cleaned: ${resetStats.cleanedTables.join(', ')}`);
      this.logger.log(`Duration: ${duration}ms`);
      this.logger.log(`Errors: ${resetStats.errors.length}`);

      return resetStats;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      const errorMessage = `Complete database reset failed: ${error.message}`;
      this.logger.error(errorMessage, error.stack);
      resetStats.errors.push(errorMessage);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Определяет порядок удаления таблиц с учетом зависимостей (foreign keys)
   * Сначала удаляем дочерние таблицы, затем родительские
   */
  private getTableDependencyOrder(): string[] {
    const allTables = [...CLEANUP_ENTITIES_LIST];

    // Разделяем таблицы на дочерние (с _components) и основные
    const childTables = allTables.filter(table =>
      table.includes('_components')
    );

    const parentTables = allTables.filter(table =>
      !table.includes('_components')
    );

    // Определяем специальный порядок для arrival_invoices из-за complex dependencies
    const arrivalInvoicesIndex = parentTables.indexOf('arrival_invoices');
    if (arrivalInvoicesIndex > -1) {
      parentTables.splice(arrivalInvoicesIndex, 1);
    }

    // Итоговый порядок: сначала дочерние, затем основные, arrival_invoices в конце
    return [...childTables, ...parentTables, ...(arrivalInvoicesIndex > -1 ? ['arrival_invoices'] : [])];
  }

  /**
   * Получение статистики по текущему состоянию таблиц из конфига
   */
  async getTablesStatistics(): Promise<Record<string, number | string>> {
    const queryRunner = this.dataSource.createQueryRunner();
    const statistics: Record<string, number | string> = {};

    try {
      await queryRunner.connect();

      console.log('[DATABASE_CLEANUP] 📊 Calculating current table statistics...');

      for (const tableName of CLEANUP_ENTITIES_LIST) {
        try {
          const query = `SELECT COUNT(*) as count FROM \`${tableName}\``;
          const result = await queryRunner.query(query);
          const count = result[0]?.count || 0;
          statistics[tableName] = count;

          console.log(`[DATABASE_CLEANUP] 📋 ${tableName}: ${count} records`);
        } catch (error) {
          const errorMessage = `Error: ${error.message}`;
          statistics[tableName] = errorMessage;
          console.error(`[DATABASE_CLEANUP] ❌ Error getting stats for ${tableName}:`, error.message);
        }
      }

      // Считаем общую статистику
      const totalRecords = Object.values(statistics).reduce((sum: number, value: any) => {
        const num = typeof value === 'number' ? value : 0;
        return sum + num;
      }, 0);

      console.log(`[DATABASE_CLEANUP] 📈 Total records across all tables: ${totalRecords}`);
      console.log('[DATABASE_CLEANUP] 📋 Statistics calculation completed');

      return statistics;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Проверка здоровья сервиса
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; tablesConfigured: number }> {
    try {
      const stats = await this.getTablesStatistics();
      const errorCount = Object.values(stats).filter(value => typeof value === 'string').length;

      return {
        status: errorCount === 0 ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        tablesConfigured: CLEANUP_ENTITIES_LIST.length,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        tablesConfigured: CLEANUP_ENTITIES_LIST.length,
      };
    }
  }
}