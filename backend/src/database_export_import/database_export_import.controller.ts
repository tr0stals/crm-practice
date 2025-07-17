import { Controller, Get, Post, Query, UploadedFile, UseInterceptors, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatabaseExportImportService } from './database_export_import.service';
import { File as MulterFile } from 'multer';
import { Response } from 'express';

@Controller('database_export_import')
export class DatabaseExportImportController {
  constructor(private readonly service: DatabaseExportImportService) {}

  // Экспорт всей БД (.sql)
  @Get('export/db')
  async exportDatabase(@Res() res: Response) {
    console.log(`[API][GET] /database_export_import/export/db`);
    // Возвращает дамп базы данных
    return this.service.exportDatabase(res);
  }

  // Импорт всей БД (.sql)
  @Post('import/db')
  @UseInterceptors(FileInterceptor('file'))
  async importDatabase(@UploadedFile() file: MulterFile) {
    console.log(`[API][POST] /database_export_import/import/db, file:`, file?.originalname);
    try {
      // Импортирует дамп базы данных
      return await this.service.importDatabase(file);
    } catch (e) {
      console.error(`[API][POST] /import/db error:`, e);
      throw e;
    }
  }

  // Экспорт таблицы (.csv/.xlsx)
  @Get('export/table')
  async exportTable(@Query('table') table: string, @Query('format') format: string, @Res() res: Response) {
    console.log(`[API][GET] /database_export_import/export/table, table=${table}, format=${format}`);
    return this.service.exportTable(res, table, format);
  }

  // Импорт таблицы (.csv/.xlsx)
  @Post('import/table')
  @UseInterceptors(FileInterceptor('file'))
  async importTable(
    @Query('table') table: string,
    @UploadedFile() file: MulterFile,
    @Body('chunkSize') chunkSize?: number,
  ) {
    console.log(`[API][POST] /database_export_import/import/table, table=${table}, file=${file?.originalname}, chunkSize=${chunkSize}`);
    try {
      // Импортирует данные таблицы с постраничной обработкой
      return await this.service.importTable(table, file, chunkSize);
    } catch (e) {
      console.error(`[API][POST] /import/table error:`, e);
      throw e;
    }
  }
} 