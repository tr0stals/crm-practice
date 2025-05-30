import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  async getAllTablesData() {
    const tables = await this.dataSource.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    const result: { tableName: string; rows: { json: string }[] }[] = [];
    for (const t of tables) {
      const tableName = t[tableKey];
      const rowsRaw = await this.dataSource.query(`SELECT * FROM \`${tableName}\``);
      // Сериализуем каждую строку в JSON
      const rows = rowsRaw.map(row => ({ json: JSON.stringify(row) }));
      result.push({ tableName, rows });
    }
    return result;
  }

  async getTableNames() {
    const tables = await this.dataSource.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    return tables.map(t => t[tableKey]);
  }
  
  async getTableColumns(tableName: string) {
    const columns = await this.dataSource.query(`SHOW COLUMNS FROM \`${tableName}\``);
    // columns[i].Field — имя столбца
    return columns.map(col => col.Field);
  }

  async getTableRows(tableName: string) {
    return await this.dataSource.query(`SELECT * FROM \`${tableName}\``);
  }
}