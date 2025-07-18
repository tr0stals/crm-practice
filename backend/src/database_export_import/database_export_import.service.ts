import {
  Injectable,
  StreamableFile,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';
import { Response } from 'express';

function getDbConfig() {
  return {
    dbName: process.env.DB_NAME || 'crm_practice',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Yoga105!',
    host: process.env.DB_HOST || 'localhost',
  };
}

function autoConvertDates(row: Record<string, any>): Record<string, any> {
  const newRow: Record<string, any> = { ...row };
  for (const key in newRow) {
    const value = newRow[key];
    if (
      typeof value === 'string' &&
      value.match(/\d{4}/) && // есть год
      value.match(/GMT|UTC|Mon|Tue|Wed|Thu|Fri|Sat|Sun/) // есть признаки даты
    ) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        newRow[key] = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
      }
    }
  }
  return newRow;
}

@Injectable()
export class DatabaseExportImportService {
  // Экспорт всей БД (.sql) через pipe на res
  async exportDatabase(res: Response) {
    const { dbName, user, password, host } = getDbConfig();
    const dumpFile = join(process.cwd(), `db_dump_${Date.now()}.sql`);
    console.log(`[EXPORT_DB] Начало экспорта БД: ${dbName} (${host})`);
    await new Promise<void>((resolve, reject) => {
      const dump = spawn('mysqldump', [
        `-u${user}`,
        `-p${password}`,
        `-h${host}`,
        dbName,
      ]);
      const writeStream = fs.createWriteStream(dumpFile);
      dump.stdout.pipe(writeStream);
      dump.stderr.on('data', (data) => {
        const msg = data.toString();
        if (
          msg.includes(
            'Using a password on the command line interface can be insecure',
          )
        ) {
          console.warn('[EXPORT_DB][mysqldump][warning]:', msg);
          return;
        }
        console.error(`[EXPORT_DB][mysqldump][stderr]:`, msg);
        reject(msg);
      });
      dump.on('close', (code) => {
        if (code === 0) {
          console.log(`[EXPORT_DB] Экспорт завершён успешно: ${dumpFile}`);
          resolve();
        } else {
          console.error(`[EXPORT_DB] mysqldump exited with code ${code}`);
          reject(`mysqldump exited with code ${code}`);
        }
      });
    });

    res.set({
      'Content-Type': 'application/sql',
      'Content-Disposition': 'attachment; filename="db_dump.sql"',
    });
    const stream = fs.createReadStream(dumpFile);
    stream.pipe(res);
    res.on('finish', () => {
      console.log('[EXPORT_DB] Ответ отправлен, удаляю файл:', dumpFile);
      try {
        fs.unlinkSync(dumpFile);
      } catch {}
    });
    stream.on('error', (err) => {
      console.error('[EXPORT_DB] Ошибка потока:', err);
      res.end();
      try {
        fs.unlinkSync(dumpFile);
      } catch {}
    });
  }

  // Импорт всей БД (.sql)
  async importDatabase(file: any): Promise<any> {
    const { dbName, user, password, host } = getDbConfig();
    if (!file || !file.buffer) {
      console.error(`[IMPORT_DB] Файл не найден или пустой`);
      throw new BadRequestException('Файл не найден или пустой');
    }
    const tmpFile = join(process.cwd(), `db_import_${Date.now()}.sql`);
    try {
      fs.writeFileSync(tmpFile, file.buffer);
      console.log(
        `[IMPORT_DB] Начало импорта БД: ${dbName} (${host}), файл: ${tmpFile}`,
      );
      await new Promise<void>((resolve, reject) => {
        const mysql = spawn('mysql', [
          `-u${user}`,
          `-p${password}`,
          `-h${host}`,
          dbName,
        ]);
        const readStream = require('fs').createReadStream(tmpFile);
        readStream.pipe(mysql.stdin);
        mysql.stderr.on('data', (data) => {
          const msg = data.toString();
          if (
            msg.includes(
              'Using a password on the command line interface can be insecure',
            )
          ) {
            console.warn('[IMPORT_DB][mysql][warning]:', msg);
            return;
          }
          console.error(`[IMPORT_DB][mysql][stderr]:`, msg);
          reject(msg);
        });
        mysql.on('close', (code) => {
          if (code === 0) {
            console.log(`[IMPORT_DB] Импорт завершён успешно`);
            resolve();
          } else {
            console.error(`[IMPORT_DB] mysql exited with code ${code}`);
            reject(`mysql exited with code ${code}`);
          }
        });
      });
      return { message: 'Импорт БД успешно завершён' };
    } catch (e) {
      console.error(`[IMPORT_DB] Ошибка при импорте:`, e);
      throw new InternalServerErrorException('Ошибка при импорте БД: ' + e);
    } finally {
      try {
        fs.unlinkSync(tmpFile);
      } catch {}
    }
  }

  // Экспорт таблицы (.csv/.xlsx) через pipe на res
  async exportTable(res: Response, table: string, format: string) {
    const { dbName, user, password, host } = getDbConfig();
    console.log(`[EXPORT_TABLE] table=${table}, format=${format}`);
    if (!table) {
      console.error(`[EXPORT_TABLE] Не указано имя таблицы`);
      throw new BadRequestException('Не указано имя таблицы');
    }
    if (!format) {
      console.error(`[EXPORT_TABLE] Не указан формат`);
      throw new BadRequestException('Не указан формат');
    }
    let filePath: string;
    let contentType: string;
    let disposition: string;
    if (format === 'csv') {
      // Новый экспорт CSV с заголовками и разделителем ;
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host,
        user,
        password,
        database: dbName,
      });
      const [rows, fields] = await connection.execute(
        `SELECT * FROM \`${table}\``,
      );
      const columns = fields.map((f: any) => f.name);
      let csv = columns.join(';') + '\n';
      for (const row of rows) {
        csv += columns.map((col) => row[col]).join(';') + '\n';
      }
      await connection.end();
      filePath = join(process.cwd(), `${table}_export_${Date.now()}.csv`);
      require('fs').writeFileSync(filePath, csv, 'utf8');
      contentType = 'text/csv';
      disposition = `attachment; filename=\"${table}.csv\"`;
    } else if (format === 'xlsx') {
      // Экспорт в xlsx через exceljs (убедиться, что первая строка — заголовки)
      const ExcelJS = require('exceljs');
      filePath = join(process.cwd(), `${table}_export_${Date.now()}.xlsx`);
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host,
        user,
        password,
        database: dbName,
      });
      const [rows, fields] = await connection.execute(
        `SELECT * FROM \`${table}\``,
      );
      const columns = fields.map((f: any) => f.name);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(table);
      worksheet.addRow(columns);
      for (const row of rows) {
        worksheet.addRow(columns.map((col) => row[col]));
      }
      await workbook.xlsx.writeFile(filePath);
      await connection.end();
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      disposition = `attachment; filename=\"${table}.xlsx\"`;
    } else {
      console.error(`[EXPORT_TABLE] Неподдерживаемый формат: ${format}`);
      throw new BadRequestException('Неподдерживаемый формат');
    }
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': disposition,
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    res.on('finish', () => {
      console.log('[EXPORT_TABLE] Ответ отправлен, удаляю файл:', filePath);
      try {
        fs.unlinkSync(filePath);
      } catch {}
    });
    stream.on('error', (err) => {
      console.error('[EXPORT_TABLE] Ошибка потока:', err);
      res.end();
      try {
        fs.unlinkSync(filePath);
      } catch {}
    });
  }

  // Импорт таблицы (.csv/.xlsx)
  async importTable(
    table: string,
    file: any,
    chunkSize: number = 1000,
  ): Promise<any> {
    const { dbName, user, password, host } = getDbConfig();
    console.log(
      `[IMPORT_TABLE] table=${table}, chunkSize=${chunkSize}, file=${file?.originalname}`,
    );
    if (!table) {
      console.error(`[IMPORT_TABLE] Не указано имя таблицы`);
      throw new BadRequestException('Не указано имя таблицы');
    }
    if (!file || !file.originalname) {
      console.error(`[IMPORT_TABLE] Файл не найден`);
      throw new BadRequestException('Файл не найден');
    }
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      // Импорт из CSV
      const { parse } = require('csv-parse/sync');
      const content = file.buffer.toString('utf-8');
      let records: any[];
      try {
        records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          delimiter: ';',
        });
      } catch (e) {
        console.error(`[IMPORT_TABLE][csv] Ошибка парсинга CSV:`, e);
        throw new BadRequestException('Ошибка парсинга CSV: ' + e);
      }
      if (!records.length) {
        console.error(`[IMPORT_TABLE][csv] CSV не содержит данных`);
        throw new BadRequestException('CSV не содержит данных');
      }
      // Получаем список колонок из первой строки
      const columns = Object.keys(records[0]);
      // Валидация: все строки должны содержать одинаковые колонки
      for (const row of records) {
        if (Object.keys(row).length !== columns.length) {
          throw new BadRequestException(
            'Некорректная структура CSV: не совпадает количество колонок',
          );
        }
      }
      // Импорт с постраничной обработкой и транзакцией
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host,
        user,
        password,
        database: dbName,
        multipleStatements: true,
      });
      let imported = 0;
      let failed = 0;
      let errors: any[] = [];
      try {
        await connection.beginTransaction();
        for (let i = 0; i < records.length; i += chunkSize) {
          const chunk = records.slice(i, i + chunkSize);
          for (const row of chunk) {
            try {
              const convertedRow = autoConvertDates(row);
              const placeholders = columns.map(() => '?').join(',');
              const sql = `INSERT INTO \`${table}\` (${columns.map((c) => `\`${c}\``).join(',')}) VALUES (${placeholders})`;
              await connection.query(
                sql,
                columns.map((c) => convertedRow[c]),
              );
              imported++;
              console.log(
                '[IMPORT_TABLE][csv] Вставлена строка:',
                convertedRow,
              );
            } catch (e) {
              failed++;
              errors.push({ row, error: e.message });
              console.error(
                `[IMPORT_TABLE][csv] Ошибка вставки строки:`,
                e.message,
              );
            }
          }
        }
        await connection.commit();
        console.log(
          `[IMPORT_TABLE][csv] Импорт завершён: imported=${imported}, failed=${failed}`,
        );
        if (errors.length)
          console.error('[IMPORT_TABLE][csv] Ошибки вставки:', errors);
      } catch (e) {
        await connection.rollback();
        console.error(`[IMPORT_TABLE][csv] Ошибка при импорте:`, e);
        throw new InternalServerErrorException('Ошибка при импорте: ' + e);
      } finally {
        await connection.end();
      }
      return { imported, failed, errors };
    } else if (ext === 'xlsx') {
      // Импорт из xlsx
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        console.error(`[IMPORT_TABLE][xlsx] Файл не содержит листов`);
        throw new BadRequestException('Файл не содержит листов');
      }
      const rows: any[] = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        rows.push(row.values);
      });
      if (rows.length < 2)
        throw new BadRequestException('Файл не содержит данных');
      // Первая строка — заголовки
      const headers = rows[0].slice(1); // row.values[0] — всегда null
      const dataRows = rows.slice(1).map((r: any[]) => r.slice(1));
      // Валидация: все строки должны содержать одинаковое количество колонок
      for (const row of dataRows) {
        if (row.length !== headers.length) {
          console.error(
            `[IMPORT_TABLE][xlsx] Некорректная структура xlsx: не совпадает количество колонок`,
          );
          throw new BadRequestException(
            'Некорректная структура xlsx: не совпадает количество колонок',
          );
        }
      }
      // Импорт с постраничной обработкой и транзакцией
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host,
        user,
        password,
        database: dbName,
        multipleStatements: true,
      });
      let imported = 0;
      let failed = 0;
      let errors: any[] = [];
      try {
        await connection.beginTransaction();
        for (let i = 0; i < dataRows.length; i += chunkSize) {
          const chunk = dataRows.slice(i, i + chunkSize);
          for (const row of chunk) {
            try {
              // row — это массив значений, нужно преобразовать в объект для autoConvertDates
              const rowObj: Record<string, any> = {};
              headers.forEach((h: string, idx: number) => {
                rowObj[h] = row[idx];
              });
              const convertedRow = autoConvertDates(rowObj);
              const placeholders = headers.map(() => '?').join(',');
              const sql = `INSERT INTO \`${table}\` (${headers.map((c: string) => `\`${c}\``).join(',')}) VALUES (${placeholders})`;
              await connection.query(
                sql,
                headers.map((c: string) => convertedRow[c]),
              );
              imported++;
            } catch (e) {
              failed++;
              errors.push({ row, error: e.message });
              console.error(
                `[IMPORT_TABLE][xlsx] Ошибка вставки строки:`,
                e.message,
              );
            }
          }
        }
        await connection.commit();
        console.log(
          `[IMPORT_TABLE][xlsx] Импорт завершён: imported=${imported}, failed=${failed}`,
        );
      } catch (e) {
        await connection.rollback();
        console.error(`[IMPORT_TABLE][xlsx] Ошибка при импорте:`, e);
        throw new InternalServerErrorException('Ошибка при импорте: ' + e);
      } finally {
        await connection.end();
      }
      return { imported, failed, errors };
    } else {
      console.error(`[IMPORT_TABLE] Неподдерживаемый формат: ${ext}`);
      throw new BadRequestException('Неподдерживаемый формат');
    }
  }
}
