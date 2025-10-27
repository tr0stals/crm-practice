import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoicesComponents } from './invoices_components.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { InvoicesComponentsDTO } from './dto/InvoiceComponentsDTO';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { Components } from 'src/components/components.entity';
import { ComponentQuantityWatcherService } from 'src/features/component-quantity-watcher/component-quantity-watcher.service';

@Injectable()
export class InvoicesComponentsService {
  constructor(
    @InjectRepository(InvoicesComponents)
    private readonly repo: Repository<InvoicesComponents>,

    @InjectRepository(ArrivalInvoices)
    private readonly arrivalInvoicesRepo: Repository<ArrivalInvoices>,

    @InjectRepository(Components)
    private readonly componentsRepo: Repository<Components>,

    private readonly componentQuantityWatcher: ComponentQuantityWatcherService,
  ) {}

  async getAll() {
    try {
      return await this.repo.find({
        relations: ['arrivalInvoices', 'components'],
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async getByInvoice(invoiceId: number) {
    try {
      return await this.repo.find({
        where: {
          arrivalInvoices: {
            id: invoiceId,
          },
        },
        relations: ['arrivalInvoices', 'components'],
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateDataById(incomingId: number) {
    try {
      const invoicesComponents = await this.getAll();

      if (!invoicesComponents)
        throw new NotFoundException('Ошибка поиска накладных с комплектующими');

      const data = invoicesComponents
        .filter((item) => item.arrivalInvoices?.id === incomingId)
        .map((item) => {
          const { arrivalInvoices, components, ...defaultData } = item;

          return {
            ...defaultData,
            arrival_invoice_date: arrivalInvoices.date,
            arrival_invoice_number: arrivalInvoices.numberInvoice,
            component_title: components.title,
          };
        });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getById(id: number) {
    try {
      return await this.repo.findOne({
        where: { id: id },
        relations: ['arrivalInvoices', 'components'],
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const invoicesComponents = await this.getAll();
      const data: any[] = [];

      if (!invoicesComponents)
        throw new NotFoundException('Ошибка поиска накладных с комплектующими');

      invoicesComponents.map((item) => {
        const { arrivalInvoices, components, ...defaultData } = item;
        const arrivalInvoiceDate = arrivalInvoices?.date;
        const arrivalInvoiceNumber = arrivalInvoices?.numberInvoice;
        const componentTitle = components?.title;

        data.push({
          ...defaultData,
          arrivalInvoiceDate,
          arrivalInvoiceNumber,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: InvoicesComponentsDTO) {
    try {
      const { arrivalInvoiceId, componentId, ...defaultData } = data;

      const arrivalInvoice = await this.arrivalInvoicesRepo.findOne({
        where: {
          id: arrivalInvoiceId,
        },
        relations: ['suppliers', 'factory'],
      });

      const component = await this.componentsRepo.findOne({
        where: {
          id: componentId,
        },
        relations: ['componentPlacements'],
      });

      if (!arrivalInvoice)
        throw new NotFoundException('Ошибка при поиске arrivalInvoices');
      if (!component)
        throw new NotFoundException('Ошибка при поиске components');

      const entity = this.repo.create({
        componentCount: data?.componentCount,
        arrivalInvoices: arrivalInvoice,
        components: component,
      });

      const result = await this.repo.save(entity);

      // Автоматически пересчитываем количество компонента
      await this.componentQuantityWatcher.onInvoicesComponentChange(
        componentId,
      );

      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<InvoicesComponents>) {
    // Получаем componentId до обновления для последующего пересчета
    const existingRecord = await this.repo.findOne({
      where: { id },
      relations: ['components'],
    });

    await this.repo.update(id, data);
    const result = await this.repo.findOne({ where: { id } });

    // Автоматически пересчитываем количество компонента, если он изменился
    if (existingRecord?.components?.id) {
      await this.componentQuantityWatcher.onInvoicesComponentChange(
        existingRecord.components.id,
      );
    }

    return result;
  }

  async remove(id: number) {
    try {
      // Получаем componentId до удаления для последующего пересчета
      const existingRecord = await this.repo.findOne({
        where: { id },
        relations: ['components'],
      });

      await this.repo.delete(id);

      // Автоматически пересчитываем количество компонента после удаления
      if (existingRecord?.components?.id) {
        await this.componentQuantityWatcher.onInvoicesComponentChange(
          existingRecord.components.id,
        );
      }
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
}
