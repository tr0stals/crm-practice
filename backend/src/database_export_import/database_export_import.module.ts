import { Module } from '@nestjs/common';
import { DatabaseExportImportService } from './database_export_import.service';
import { DatabaseExportImportController } from './database_export_import.controller';

@Module({
  providers: [DatabaseExportImportService],
  controllers: [DatabaseExportImportController],
  exports: [DatabaseExportImportService],
})
export class DatabaseExportImportModule {} 