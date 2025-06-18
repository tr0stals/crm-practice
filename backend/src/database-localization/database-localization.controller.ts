import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseLocalizationService } from './database-localization.service';
import {
  FieldDisplayNameResponse,
  LocalizationData,
  TableLocalization,
} from './types';

@Controller('localization')
export class DatabaseLocalizationController {
  constructor(
    private readonly localizationService: DatabaseLocalizationService,
  ) {}

  @Get()
  getAllLocalization(): LocalizationData {
    return this.localizationService.getAllLocalization();
  }

  // Получить все таблицы с displayName
  @Get('tables')
  getAllTables() {
    return this.localizationService.getAllTableDisplayNames();
  }

  // Получить всю локализацию для таблицы
  @Get('tables/:tableName')
  getTableLocalization(@Param('tableName') tableName: string) {
    return this.localizationService.getTableLocalization(tableName);
  }

  // Получить displayName таблицы
  @Get('tables/:tableName/displayName')
  getTableDisplayName(@Param('tableName') tableName: string) {
    return {
      displayName: this.localizationService.getTableDisplayName(tableName),
    };
  }

  // Получить все поля таблицы с displayName
  @Get('tables/:tableName/fields')
  getTableFields(@Param('tableName') tableName: string) {
    return this.localizationService.getTableFieldsDisplayNames(tableName);
  }

  // Получить displayName поля
  @Get('tables/:tableName/fields/:fieldName/displayName')
  getFieldDisplayName(
    @Param('tableName') tableName: string,
    @Param('fieldName') fieldName: string,
  ) {
    return {
      displayName: this.localizationService.getFieldDisplayName(
        tableName,
        fieldName,
      ),
    };
  }
}
