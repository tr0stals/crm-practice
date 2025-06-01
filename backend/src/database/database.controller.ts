import { Controller, Delete, Get, Param, Post, Body, Put } from '@nestjs/common';
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

  @Delete(':tableName/:id')
  async deleteTableRecord(@Param('tableName') tableName: string, @Param('id') id: string) {
    return await this.databaseService.deleteTableRecord(tableName, id);
  }

  @Post(':tableName')
  async addTableRecord(@Param('tableName') tableName: string, @Body() record: any) {
    return await this.databaseService.addTableRecord(tableName, record);
  }

  @Put(':tableName/:id')
  async updateTableRecord(@Param('tableName') tableName: string, @Param('id') id: string, @Body() record: any) {
    return await this.databaseService.updateTableRecord(tableName, id, record);
  }
} 