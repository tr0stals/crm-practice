import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoicesComponents } from './invoices-components.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InvoicesComponentsService {
  constructor(
    @InjectRepository(InvoicesComponents)
    private readonly repo: Repository<InvoicesComponents>,
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
        const arrivalInvoiceTitle = arrivalInvoices.date;
        const componentTitle = components.title;

        data.push({
          ...defaultData,
          arrivalInvoiceTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<InvoicesComponents>) {
    try {
      const entity = this.repo.create(data);
      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<InvoicesComponents>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
