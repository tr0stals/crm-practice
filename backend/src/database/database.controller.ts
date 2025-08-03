import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Put,
  Query,
  Headers,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { NODE_TYPE_TO_TABLE } from './nodeTypesMap';
import { PERMISSION_MATRIX } from './rolePermissions';

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

  @Get('treeTables')
  async getTree() {
    return await this.databaseService.getTreeTables();
  }

  @Get('treeTables/:profession')
  async getTreeByProfession(@Param('profession') profession: string) {
    return await this.databaseService.getTreeTablesByProfession(profession);
  }

  @Get('nodeTypesMap')
  getNodeTypesMap() {
    return NODE_TYPE_TO_TABLE;
  }

  @Get('fieldHints')
  getFieldHints() {
    return this.databaseService.getFieldHints();
  }

  @Get('permissions')
  getPermissions() {
    return PERMISSION_MATRIX;
  }

  @Get(':tableName')
  async getTableRows(
    @Param('tableName') tableName: string,
    @Headers('profession') profession?: string,
  ) {
    return await this.databaseService.getTableRows(tableName, profession);
  }

  @Get(':tableName/search')
  async searchTableRows(
    @Param('tableName') tableName: string,
    @Query('query') query: string,
  ) {
    return await this.databaseService.searchTableRows(tableName, query);
  }

  @Get(':tableName/relations')
  async getTableRelations(@Param('tableName') tableName: string) {
    return this.databaseService.getTableRelations(tableName);
  }

  @Get(':tableName/columns')
  async getTableColumns(@Param('tableName') tableName: string) {
    return await this.databaseService.getTableColumns(tableName);
  }

  @Get(':tableName/column/:columnName/values')
  async getTableColumnValues(
    @Param('tableName') tableName: string,
    @Param('columnName') columnName: string,
  ) {
    return await this.databaseService.getTableColumnValues(
      tableName,
      columnName,
    );
  }

  @Get('getFormMetaData/:tableName')
  async getFormMetaData(@Param('tableName') tableName: string) {
    return await this.databaseService.getFormMetadata(tableName);
  }

  @Get(':tableName/:id')
  async getTableRowById(
    @Param('tableName') tableName: string,
    @Param('id') id: string,
  ) {
    return await this.databaseService.getTableRowById(tableName, id);
  }

  @Delete(':tableName/:id')
  async deleteTableRecord(
    @Param('tableName') tableName: string,
    @Param('id') id: string,
    @Headers('profession') profession?: string,
  ) {
    return await this.databaseService.deleteTableRecord(tableName, id, profession);
  }

  @Post(':tableName')
  async addTableRecord(
    @Param('tableName') tableName: string,
    @Body() record: any,
    @Headers('profession') profession?: string,
  ) {
    return await this.databaseService.addTableRecord(tableName, record, profession);
  }

  @Put(':tableName/:id')
  async updateTableRecord(
    @Param('tableName') tableName: string,
    @Param('id') id: string,
    @Body() record: any,
    @Headers('profession') profession?: string,
  ) {
    return await this.databaseService.updateTableRecord(tableName, id, record, profession);
  }
}
