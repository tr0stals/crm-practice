import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArrivalInvoices } from './arrival_invoices.entity';

@Injectable()
export class ArrivalInvoicesService {
  constructor(
    @InjectRepository(ArrivalInvoices)
    private readonly repo: Repository<ArrivalInvoices>,
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
        const factoryName = factory.shortName;
        const supplierName = suppliers.shortName;

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

  async create(data: Partial<ArrivalInvoices>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ArrivalInvoices>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
