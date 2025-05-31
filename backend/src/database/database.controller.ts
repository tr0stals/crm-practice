import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('all')
  async getAllTables() {
    return await this.databaseService.getAllTablesData();
  }

  @Get('names')
  async getTableNames() {
    const tables = await this.databaseService.getTableNames();
    return tables;
  }

  @Get(':tableName')
  async getTableRows(@Param('tableName') tableName: string) {
    return await this.databaseService.getTableRows(tableName);
  }

  @Get(':tableName/columns')
  async getTableColumns(@Param('tableName') tableName: string) {
    return await this.databaseService.getTableColumns(tableName);
    }
} 