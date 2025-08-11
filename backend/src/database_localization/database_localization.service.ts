import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LocalizationData, TableLocalization } from './types';

@Injectable()
export class DatabaseLocalizationService {
  private localizationData: LocalizationData;

  constructor() {
    this.loadLocalizationData();
  }

  private loadLocalizationData() {
    try {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'config',
        'database-localization.json',
      );
      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.localizationData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Ошибка загрузки файла локализации:', error);
      this.localizationData = { tables: {} };
    }
  }

  getTableDisplayName(tableName: string): string {
    // console.log(tableName);
    return this.localizationData.tables[tableName]?.displayName || tableName;
  }

  getFieldDisplayName(tableName: string, fieldName: string): string {
    return (
      this.localizationData.tables[tableName]?.fields[fieldName] || fieldName
    );
  }

  getAllLocalization(): LocalizationData {
    return this.localizationData;
  }

  getTableLocalization(tableName: string): TableLocalization | null {
    return this.localizationData.tables[tableName] || null;
  }

  hasTableLocalization(tableName: string): boolean {
    return !!this.localizationData.tables[tableName];
  }

  hasFieldLocalization(tableName: string, fieldName: string): boolean {
    return !!this.localizationData.tables[tableName]?.fields[fieldName];
  }

  getAllTableDisplayNames(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [table, data] of Object.entries(this.localizationData.tables)) {
      result[table] = data.displayName;
    }

    return result;
  }

  getTableFieldsDisplayNames(tableName: string): Record<string, string> {
    return this.localizationData.tables[tableName]?.fields || {};
  }
}
