// Типы для утилиты очистки базы данных

export interface CleanupStatistics {
  startTime: Date;
  endTime: Date;
  deletedRecords: number;
  errors: string[];
  cleanedTables: string[];
}