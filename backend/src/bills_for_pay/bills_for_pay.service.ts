import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillsForPay } from './bills_for_pay.entity';

@Injectable()
export class BillsForPayService {
  constructor(
    @InjectRepository(BillsForPay)
    private readonly repo: Repository<BillsForPay>,
  ) {}

  async getAll() {
    return this.repo.find({
      relations: ['supplier', 'factory'],
    });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['supplier', 'factory'],
    });
  }

  async generateData() {
    try {
      const bills = await this.getAll();
      const data: any[] = [];

      if (!bills) throw new NotFoundException('Не удалось найти bills-for-pay');

      bills.map((item) => {
        const { factory, supplier, ...defaultData } = item;
        const factoryName = factory.shortName;
        const supplierName = supplier.shortName;

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

  async create(data: Partial<BillsForPay>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<BillsForPay>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
