import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { databaseParentIdStrategies } from './databaseParentIdStrategies';
import { FIELD_HINTS_MAP } from './fieldHintsMap';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  async getAllTablesData() {
    const tables = await this.dataSource.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    const result: { tableName: string; rows: { json: string }[] }[] = [];
    for (const t of tables) {
      const tableName = t[tableKey];
      const rowsRaw = await this.dataSource.query(
        `SELECT * FROM \`${tableName}\``,
      );
      // Сериализуем каждую строку в JSON
      const rows = rowsRaw.map((row) => ({ json: JSON.stringify(row) }));
      result.push({ tableName, rows });
    }
    return result;
  }

  async getTableNames() {
    const tables = await this.dataSource.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    return tables.map((t) => t[tableKey]);
  }

  getFieldHints() {
    return FIELD_HINTS_MAP;
  }

  async getTableColumns(tableName: string) {
    const columns = await this.dataSource.query(
      `SHOW COLUMNS FROM \`${tableName}\``,
    );
    // columns[i].Field — имя столбца
    return columns.map((col) => col.Field);
  }

  async getTableRows(tableName: string) {
    try {
      return await this.dataSource.query(`SELECT * FROM \`${tableName}\``);
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      throw error; // Перебрасываем ошибку, чтобы она дошла до контроллера и далее
    }
  }

  async getTableColumnValues(tableName: string, columnName: string) {
    return await this.dataSource.query(
      `SELECT DISTINCT ${columnName} FROM \`${tableName}\``,
    );
  }

  async getTableRelations(tableName: string) {
    const metadata = this.dataSource.entityMetadatas.find(
      (meta) => meta.tableName === tableName,
    );

    if (!metadata) {
      throw new Error(`Table ${tableName} not found`);
    }

    const relations = metadata.relations.map((rel) => ({
      propertyName: rel.propertyName, // например, licenseTypes
      referencedColumn: rel.inverseEntityMetadata.tableName, // например, license_types
      foreignKey: rel.joinColumns[0]?.databaseName || `${rel.propertyName}Id`, // licenseTypeId
    }));

    return relations;
  }

  async getTableRowById(tableName: string, id: string) {
    return await this.dataSource.query(
      `SELECT * FROM \`${tableName}\` WHERE id = ? LIMIT 1`,
      [id],
    );
  }

  async deleteTableRecord(tableName: string, id: string) {
    return await this.dataSource.query(
      `DELETE FROM \`${tableName}\` WHERE id = ${id}`,
    );
  }

  async addTableRecord(tableName: string, record: any) {
    return await this.dataSource.query(`INSERT INTO \`${tableName}\` SET ?`, [
      record,
    ]);
  }

  async updateTableRecord(tableName: string, id: string, record: any) {
    return await this.dataSource.query(
      `UPDATE \`${tableName}\` SET ? WHERE id = ${id}`,
      [record],
    );
  }

  async searchTableRows(tableName: string, query: string) {
    // Получаем все колонки
    const columns = await this.getTableColumns(tableName);
    if (!columns || columns.length === 0) return [];
    // Формируем WHERE для поиска по всем колонкам
    const likeStatements = columns
      .map((col) => `CAST(\`${col}\` AS CHAR) LIKE ?`)
      .join(' OR ');
    const params = columns.map(() => `%${query}%`);
    const sql = `SELECT * FROM \`${tableName}\` WHERE ${likeStatements}`;
    return await this.dataSource.query(sql, params);
  }

  private async inferRelatedTable(tableName: string, column: string) {
    const relatedTables = await this.getTableRelations(tableName);

    const found = relatedTables.find((item) => item.foreignKey === column);

    return found?.referencedColumn ?? null;
  }

  private async getSelectOptions(
    relatedTable: any,
    currentId?: number,
    columnName?: string,
    tableName?: string,
  ) {
    // // Явная обработка billId для bills_components
    // if (columnName === 'billId' && tableName === 'bills_components') {
    //   // Импортируем класс здесь, чтобы избежать циклических зависимостей
    //   const { BillsForPay } = await import('../bills_for_pay/bills_for_pay.entity');
    //   const bills = await this.dataSource.getRepository(BillsForPay).find();
    //   return bills.map((bill) => ({
    //     id: bill.id,
    //     label: bill.numberBill ? `Счет №${bill.numberBill}` : `ID ${bill.id}`,
    //   }));
    // }
    // if (columnName === 'arrivalInvoiceId' && tableName === 'invoices_components') {
    //   const { ArrivalInvoices } = await import('../arrival_invoices/arrival_invoices.entity');
    //   const arrivalInvoices = await this.dataSource.getRepository(ArrivalInvoices).find();
    //   return arrivalInvoices.map((arrivalInvoice) => ({
    //     id: arrivalInvoice.id,
    //     label: arrivalInvoice.numberInvoice ? `Накладная №${arrivalInvoice.numberInvoice}` : `ID ${arrivalInvoice.id}`,
    //   }));
    // }
    // Стандартная логика для остальных случаев
    const metadata = this.dataSource.getMetadata(relatedTable);
    const relationNames = metadata.relations.map((rel) => rel.propertyName);

    const rows = await this.dataSource.getRepository(relatedTable).find({
      relations: relationNames,
    });
    console.log('ROWSSSSSSS!!!', rows);
    // Логирование для определения какие поля и таблицы приходят
    if (rows.length > 0) {
      console.log('Поля первой строки:', Object.keys(rows[0]));
      console.log('Содержимое первой строки:', rows[0]);
    }

    // Стандартная логика для остальных случаев
    return rows.map((row) => ({
      id: row.id,
      label:
        row.title ||
        row.name ||
        row.state ||
        row.shortName ||
        row.numberBill ||
        row.numberInvoice ||
        (row.licenseCode && row.licenseTypes
          ? `Лицензия: ${row.licenseCode} Тип: ${row.licenseTypes.title}`
          : '') ||
        (row.shipmentDate && row.price
          ? `Дата отгрузки: ${row.shipmentDate} Цена: ${row.price}`
          : '') ||
        (row.placementType && row.placementType.title
          ? `${row.placementType.title} `
          : '') +
          (row.building ? `${row.building} ` : '') +
          (row.room ? `${row.room}` : '') ||
        (row.peoples
          ? `${row.peoples.firstName} ${row.peoples.lastName} ${row.peoples.middleName}`
          : row.code || `${row.firstName} ${row.lastName} ${row.middleName}`),
    }));
  }

  async getFormMetadata(tableName: string, currentId?: number) {
    // Получаем подробную информацию о колонках
    const columnsInfo = await this.dataSource.query(
      `SHOW COLUMNS FROM \`${tableName}\``,
    );

    const formStructure: Record<string, any> = {};

    for (const colInfo of columnsInfo) {
      const column = colInfo.Field;
      const columnType = colInfo.Type; // например, 'date', 'int', 'varchar(255)'

      // Для organizations parentId — асинхронно получаем типы организаций
      if (tableName === 'organizations' && column === 'parentId') {
        const orgTypes = await this.dataSource
          .getRepository('organization_types')
          .find();
        formStructure[column] = {
          type: 'select',
          options: orgTypes.map((t) => ({ id: t.id, label: t.title })),
        };
        continue;
      }
      // Универсальная обработка parentId для всех таблиц из стратегии
      if (column === 'parentId' && databaseParentIdStrategies[tableName]) {
        const strategy = databaseParentIdStrategies[tableName];
        formStructure[column] = {
          type: 'select',
          options:
            typeof strategy.options === 'function' ? strategy.options() : [],
        };
        continue;
      }
      if (column.endsWith('Id')) {
        const relatedTable = await this.inferRelatedTable(tableName, column);

        formStructure[column] = {
          type: 'select',
          options: relatedTable
            ? await this.getSelectOptions(
                relatedTable,
                currentId,
                column,
                tableName,
              )
            : [],
        };
      } else if (columnType.startsWith('date')) {
        formStructure[column] = { type: 'date' };
      } else if (column.toLowerCase().includes('date')) {
        formStructure[column] = { type: 'date' };
      } else if (column.toLowerCase().includes('vat')) {
        formStructure[column] = { type: 'checkbox' };
      } else {
        formStructure[column] = { type: 'input' };
      }
    }

    return formStructure;
  }
}
