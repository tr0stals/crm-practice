import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { databaseParentIdStrategies } from './databaseParentIdStrategies';
import { FIELD_HINTS_MAP } from './fieldHintsMap';
import { CurrentTasksService } from '../current_tasks/current_tasks.service';
import { entities } from './config/entitiesMap';
import {
  getTreeViewEntities,
  canRead,
  canWrite,
  canWriteSelf,
} from './rolePermissions';
import { WsGateway } from '../websocket/ws.gateway';
import { DatabaseLocalizationService } from 'src/database_localization/database_localization.service';
import { EmployeesService } from 'src/employees/employees.service';
import { StandsService } from 'src/stands/stands.service';
import { PcbsService } from 'src/pcbs/pcbs.service';
import { ComponentsService } from 'src/components/components.service';

@Injectable()
export class DatabaseService {
  constructor(
    private dataSource: DataSource,
    private currentTasksService: CurrentTasksService,
    private employeesService: EmployeesService,
    private standsService: StandsService,
    private pcbsService: PcbsService,
    private componentsService: ComponentsService,
    private readonly wsGateway: WsGateway,
    private readonly databaseLocalizationService: DatabaseLocalizationService,
  ) {}

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

  async getTableRows(tableName: string, profession?: string) {
    try {
      // Проверяем права доступа, если указана профессия
      if (profession && !canRead(tableName, profession)) {
        throw new Error(
          `Access denied: ${profession} cannot read ${tableName}`,
        );
      }

      return await this.dataSource.query(`SELECT * FROM \`${tableName}\``);
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      throw error; // Перебрасываем ошибку, чтобы она дошла до контроллера и далее
    }
  }

  async getTreeTables() {
    const tree: any[] = [];

    for (const entity of entities) {
      const tableRelations = await this.getTableRelations(entity);

      // Убираем дубликаты по referencedColumn
      const uniqueRelationsMap = new Map<string, (typeof tableRelations)[0]>();
      for (const item of tableRelations) {
        if (
          item.referencedColumn &&
          !uniqueRelationsMap.has(item.referencedColumn) &&
          !entities.includes(item.referencedColumn) &&
          ![
            'invoices_components',
            'bills_components',
            'current_tasks_components',
            'order_requests_components',
            'organization_types',
            'pcb_order_states',
            'server_arrivals',
            'employees_vacations',
            'license_types',
            'shipments',
            'shipment_package',
            'shipment_trips',
            'shipments_stands',
            'supplier_components',
          ].includes(item.referencedColumn)
        ) {
          uniqueRelationsMap.set(item.referencedColumn, item);
        }
      }

      const uniqueRelations = Array.from(uniqueRelationsMap.values());

      const children = uniqueRelations.map((item, index) => ({
        id: index + 1,
        name: item.referencedColumn,
        nodeType: item.referencedColumn,
      }));

      tree.push({
        name: entity,
        nodeType: entity,
        children,
      });
    }

    return tree;
  }

  async getTreeTablesByProfession(profession: string) {
    // Получаем список доступных сущностей для данной профессии
    const availableEntities = getTreeViewEntities(profession);

    const tree: any[] = [];

    for (const entity of availableEntities) {
      const tableRelations = await this.getTableRelations(entity);

      // Убираем дубликаты по referencedColumn
      const uniqueRelationsMap = new Map<string, (typeof tableRelations)[0]>();
      for (const item of tableRelations) {
        if (
          item.referencedColumn &&
          !uniqueRelationsMap.has(item.referencedColumn) &&
          !entities.includes(item.referencedColumn)
        ) {
          uniqueRelationsMap.set(item.referencedColumn, item);
        }
      }

      const uniqueRelations = Array.from(uniqueRelationsMap.values());

      const children = uniqueRelations.map((item, index) => ({
        id: index + 1,
        name: item.referencedColumn,
        nodeType: item.referencedColumn,
      }));

      tree.push({
        name: entity,
        nodeType: entity,
        children,
      });
    }

    return tree;
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

  // Находит все внешние ключи, которые ссылаются на указанную таблицу в текущей БД
  private async getReferencingForeignKeys(
    targetTable: string,
  ): Promise<Array<{ tableName: string; columnName: string }>> {
    const rows = await this.dataSource.query(
      `SELECT TABLE_NAME as tableName, COLUMN_NAME as columnName
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
         AND REFERENCED_TABLE_NAME = ?`,
      [targetTable],
    );
    return (
      rows?.map((r: any) => ({
        tableName: r.tableName,
        columnName: r.columnName,
      })) ?? []
    );
  }

  // Считает, сколько записей реально блокируют удаление по каждому FK
  private async getBlockingReferences(
    targetTable: string,
    id: string,
  ): Promise<Array<{ tableName: string; columnName: string; count: number }>> {
    const fks = await this.getReferencingForeignKeys(targetTable);
    if (!fks || fks.length === 0) return [];

    const counts = await Promise.all(
      fks.map(async (fk) => {
        try {
          const res = await this.dataSource.query(
            `SELECT COUNT(*) as cnt FROM \`${fk.tableName}\` WHERE \`${fk.columnName}\` = ?`,
            [id],
          );
          const cnt = Array.isArray(res) ? Number(res[0]?.cnt || 0) : 0;
          return { ...fk, count: cnt };
        } catch (_) {
          // Если не удалось посчитать — не блокируем
          return { ...fk, count: 0 };
        }
      }),
    );

    // Оставляем только реальные блокировки и агрегируем по таблице
    const byTable = new Map<string, number>();
    for (const c of counts) {
      if (c.count > 0) {
        byTable.set(c.tableName, (byTable.get(c.tableName) || 0) + c.count);
      }
    }
    return Array.from(byTable.entries()).map(([tableName, count]) => ({
      tableName,
      columnName: '',
      count,
    }));
  }

  private buildBlockedMessage(
    blocks: Array<{ tableName: string; count: number }>,
  ): string {
    const parts = blocks
      .sort((a, b) => a.tableName.localeCompare(b.tableName))
      .map(
        (b) =>
          `${this.databaseLocalizationService.getTableDisplayName(b.tableName)} (${b.count})`,
      );
    const list = parts.join(', ');
    return `Невозможно удалить запись. Есть связанные записи: ${list}. Удалите их сначала.`;
  }

  async deleteTableRecord(
    tableName: string,
    id: string,
    profession?: string,
    userId?: number,
  ) {
    // Проверяем права доступа, если указана профессия
    if (profession && !canWrite(tableName, profession)) {
      throw new Error(
        `Access denied: ${profession} cannot write to ${tableName}`,
      );
    }
    try {
      // удаляет запись, если нет связанных записей
      const blocks = await this.getBlockingReferences(tableName, id);
      if (blocks.length > 0) {
        const msg = this.buildBlockedMessage(blocks);
        if (userId) {
          this.wsGateway.sendNotification(userId.toString(), msg, 'error');
        }
        // Выбрасываем ту же информацию в ответ API
        const { HttpException, HttpStatus } = await import('@nestjs/common');
        throw new HttpException({ message: msg }, HttpStatus.BAD_REQUEST);
      }
      console.log('DELETE START', tableName, id, profession, userId);
      const result = await this.dataSource.query(
        `DELETE FROM \`${tableName}\` WHERE id = ?`,
        [id],
      );
      // Если дошли сюда — удаление прошло успешно
      if (userId) {
        const successMsg = `Запись удалена из таблицы "${tableName}"`;
        this.wsGateway.sendNotification(
          userId.toString(),
          successMsg,
          'success',
        );
      }
      return result;
    } catch (e: any) {
      console.log('DELETE ERROR', e);
      // Fallback: если вдруг всё же прилетела низкоуровневая ошибка FK — отправим одно уведомление
      if (e.code === 'ER_ROW_IS_REFERENCED_2' && userId) {
        const match = e.sqlMessage?.match(/`([^`]+)`\.`([^`]+)`/);
        const fkTable = match ? match[2] : '';
        const msg = `Невозможно удалить запись. Есть связанные записи: ${fkTable ? fkTable + ' (1)' : 'в связанных таблицах'}. Удалите их сначала.`;
        this.wsGateway.sendNotification(userId.toString(), msg, 'error');
      }
      throw e;
    }
  }

  async deleteTableRecordWithCleanup(
    tableName: string,
    id: string,
    profession?: string,
    userId?: number,
  ) {
    // Проверяем права доступа, если указана профессия
    if (profession && !canWrite(tableName, profession)) {
      throw new Error(
        `Access denied: ${profession} cannot write to ${tableName}`,
      );
    }
    try {
      console.log(
        'DELETE WITH CLEANUP START',
        tableName,
        id,
        profession,
        userId,
      );

      // Пытаемся обнулить все FK-ссылки (SET NULL) перед удалением
      const fks = await this.getReferencingForeignKeys(tableName);
      try {
        await this.dataSource.transaction(async (manager) => {
          for (const fk of fks) {
            console.log(fk);

            // Обнуляем FK, если колонка допускает NULL; если нет — БД выбросит ошибку
            await manager.query(
              `UPDATE \`${fk.tableName}\` SET \`${fk.columnName}\` = NULL WHERE \`${fk.columnName}\` = ?`,
              [id],
            );
          }
          // После обнуления пробуем удалить запись
          await manager.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [
            id,
          ]);
        });
      } catch (nullifyErr: any) {
        // Если не удалось обнулить (например, NOT NULL), вернём детерминированную ошибку со списком блокировок
        const blocks = await this.getBlockingReferences(tableName, id);
        if (blocks.length > 0) {
          const msg = this.buildBlockedMessage(blocks);
          if (userId) {
            this.wsGateway.sendNotification(userId.toString(), msg, 'error');
          }
          const { HttpException, HttpStatus } = await import('@nestjs/common');
          throw new HttpException({ message: msg }, HttpStatus.BAD_REQUEST);
        }
        // Иначе перебросим исходную ошибку
        throw nullifyErr;
      }

      // Если дошли сюда — удаление прошло успешно
      if (userId) {
        const successMsg = `Запись удалена из таблицы "${tableName}" (с очисткой связей)`;
        this.wsGateway.sendNotification(
          userId.toString(),
          successMsg,
          'success',
        );
      }
      return { affected: 1 };
    } catch (e: any) {
      console.log('DELETE WITH CLEANUP ERROR', e);
      // Fallback: если вдруг всё же прилетела низкоуровневая ошибка FK — отправим одно уведомление
      if (e.code === 'ER_ROW_IS_REFERENCED_2' && userId) {
        const match = e.sqlMessage?.match(/`([^`]+)`\.`([^`]+)`/);
        const fkTable = match ? match[2] : '';
        const msg = `Невозможно удалить запись. Есть связанные записи: ${fkTable ? fkTable + ' (1)' : 'в связанных таблицах'}. Удалите их сначала.`;
        this.wsGateway.sendNotification(userId.toString(), msg, 'error');
      }
      throw e;
    }
  }

  async addTableRecord(tableName: string, record: any, profession?: string) {
    // Проверяем права доступа, если указана профессия
    if (profession && !canWrite(tableName, profession)) {
      throw new Error(
        `Access denied: ${profession} cannot write to ${tableName}`,
      );
    }

    // Санитизация дат: пустые строки -> NULL для всех date-колонок
    try {
      const columnsInfo = await this.dataSource.query(
        `SHOW COLUMNS FROM \`${tableName}\``,
      );
      const dateFields = new Set<string>(
        (columnsInfo || [])
          .filter(
            (c: any) =>
              typeof c?.Type === 'string' &&
              c.Type.toLowerCase().startsWith('date'),
          )
          .map((c: any) => c.Field),
      );
      for (const key of Object.keys(record || {})) {
        const val = record[key];
        const isEmpty = val === '' || val === undefined || val === null;
        if (dateFields.has(key)) {
          if (isEmpty) {
            record[key] = null;
          }
        }
      }
    } catch (_) {
      // no-op: если не удалось получить метаданные — продолжаем как есть
    }

    if (tableName === 'current_tasks') {
      console.log('=== DATABASE SERVICE: ПЕРЕДАЕМ В CURRENTTASKSSERVICE ===');
      return await this.currentTasksService.create(record);
    }
    if (tableName === 'employees') {
      console.log('=== DATABASE SERVICE: ПЕРЕДАЕМ В EMPLOYEESSERVICE ===');
      return await this.employeesService.create(record);
    }
    if (tableName === 'stands') {
      console.log('=== DATABASE SERVICE: ПЕРЕДАЕМ В STANDSSERVICE ===');
      return await this.standsService.create(record);
    }
    if (tableName === 'pcbs') {
      console.log('=== DATABASE SERVICE: ПЕРЕДАЕМ В PCBSSERVICE ===');
      return await this.pcbsService.create(record);
    }
    if (tableName === 'components') {
      console.log('=== DATABASE SERVICE: ПЕРЕДАЕМ В COMPONENTSSERVICE ===');
      return await this.componentsService.create(record);
    }
    return await this.dataSource.query(`INSERT INTO \`${tableName}\` SET ?`, [
      record,
    ]);
  }

  async updateTableRecord(
    tableName: string,
    id: string,
    record: any,
    profession?: string,
  ) {
    // Проверяем права доступа, если указана профессия
    if (profession && !canWrite(tableName, profession)) {
      throw new Error(
        `Access denied: ${profession} cannot write to ${tableName}`,
      );
    }

    if (tableName === 'employees') {
      return await this.employeesService.update(+id, record);
    }
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
    // console.log('ROWSSSSSSS!!!', rows);
    // // Логирование для определения какие поля и таблицы приходят
    // if (rows.length > 0) {
    //   console.log('Поля первой строки:', Object.keys(rows[0]));
    //   console.log('Содержимое первой строки:', rows[0]);
    // }

    // Стандартная логика для остальных случаев
    return rows.map((row) => ({
      id: row.id,
      label:
        row.title ||
        row.name ||
        row.state ||
        row.shortName ||
        row.professions?.title ||
        row.rights?.title ||
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
            typeof strategy.options === 'function'
              ? await strategy.options(this.dataSource)
              : [],
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
