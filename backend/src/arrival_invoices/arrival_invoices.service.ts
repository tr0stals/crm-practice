import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ArrivalInvoices } from './arrival_invoices.entity';
import { InvoicesComponents } from '../invoices_components/invoices_components.entity';
import { ArrivalInvoicesDTO } from './dto/ArrivalInvoicesDTO';
import { Organizations } from 'src/organizations/organizations.entity';

@Injectable()
export class ArrivalInvoicesService {
  constructor(
    @InjectRepository(ArrivalInvoices)
    private readonly repo: Repository<ArrivalInvoices>,
    @InjectRepository(InvoicesComponents)
    private readonly invoicesComponentsRepo: Repository<InvoicesComponents>,
    @InjectRepository(Organizations)
    private readonly organizationRepository: Repository<Organizations>,
  ) {}

  async getAll() {
    return this.repo.find({
      relations: ['suppliers', 'factory'],
    });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['suppliers', 'factory'],
    });
  }

  async generateData() {
    try {
      const arrivalInvoices = await this.getAll();
      const data: any[] = [];

      if (!arrivalInvoices)
        throw new NotFoundException('Не удалось найти arrivalInvoices');

      arrivalInvoices.map((item) => {
        const { factory, suppliers, ...defaultData } = item;
        const factoryName = factory?.shortName;
        const supplierName = suppliers?.shortName;

        data.push({
          ...defaultData,
          factoryName,
          supplierName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: ArrivalInvoicesDTO) {
    try {
      const { supplierId, factoryId, ...defaultData } = data;
      const supplierEntity = await this.organizationRepository.findOne({
        where: { id: supplierId },
        relations: ['organizationTypes'],
      });

      const factoryEntity = await this.organizationRepository.findOne({
        where: { id: factoryId },
        relations: ['organizationTypes'],
      });

      const entity = this.repo.create({
        ...defaultData,
        suppliers: supplierEntity,
        factory: factoryEntity,
      } as DeepPartial<ArrivalInvoices>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<ArrivalInvoices>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    try {
      await this.repo.delete(id);
    } catch (e: any) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        const match = e.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
        let tableName = match ? match[2] : '';

        throw new HttpException(
          {
            message: `Невозможно удалить запись. Есть связанные записи в таблице "${tableName}". Удалите их сначала.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }

  async getArrivalInvoicesTree() {
    // Получаем все накладные с нужными связями и их компоненты
    const arrivalInvoices = await this.repo.find({
      relations: [
        'suppliers',
        'factory',
        'invoicesComponents',
        'invoicesComponents.components',
      ],
      order: { date: 'DESC' },
    });

    // console.log(
    //   'Arrival invoices with components:',
    //   arrivalInvoices.map((invoice) => ({
    //     id: invoice.id,
    //     numberInvoice: invoice.numberInvoice,
    //     componentsCount: invoice.invoicesComponents?.length || 0,
    //   })),
    // );

    // Группируем по дате
    const grouped = {};
    for (const invoice of arrivalInvoices) {
      const date = invoice.date ? String(invoice.date) : 'Без даты';
      if (!grouped[date]) grouped[date] = [];

      const supplierName =
        invoice.suppliers?.shortName || 'Поставщик не указан';
      const dateTimeToWarehouse = invoice.dateTimeToWarehouse
        ? String(invoice.dateTimeToWarehouse)
        : 'Дата не указана';
      const vatText = invoice.vat ? 'Да' : 'Нет';
      const price = `${invoice.price} руб.`;

      // Получаем компоненты для этой накладной
      const invoiceComponents = invoice.invoicesComponents || [];

      const invoiceObj = {
        id: invoice.id,
        name: [
          `Номер накладной: ${invoice.numberInvoice}`,
          `Поставщик: ${supplierName}`,
          `Дата поступления: ${dateTimeToWarehouse}`,
          `НДС: ${vatText}`,
          `Цена: ${price}`,
        ].join(' | '),
        nodeType: 'arrival_invoices',
        numberInvoice: invoice.numberInvoice,
        supplierName,
        dateTimeToWarehouse,
        vat: invoice.vat,
        price: invoice.price,
        children: invoiceComponents.map((component) => ({
          id: component.id,
          name: [
            component.components?.title || 'Компонент не указан',
            `Кол-во: ${component.componentCount}`,
          ].join(' | '),
          nodeType: 'invoices_components',
          componentTitle: component.components?.title,
          componentCount: component.componentCount,
          children: [],
        })),
      };

      grouped[date].push(invoiceObj);
    }

    // Формируем объект для TreeView
    return {
      name: 'Накладные поступления',
      children: Object.entries(grouped).map(([date, invoices]) => ({
        name: date,
        date: date,
        children: (invoices as any[]).map((invoiceObj) => ({
          ...invoiceObj,
        })),
      })),
    };
  }
}
