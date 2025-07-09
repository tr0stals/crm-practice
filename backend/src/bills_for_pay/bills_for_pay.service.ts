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
      const bills = await this.getAll();
      const data: any[] = [];

      if (!bills) throw new NotFoundException('Не удалось найти bills-for-pay');

      bills.map((item) => {
        const { factory, suppliers, ...defaultData } = item;
        const factoryName = factory?.shortName;
        const supplierName = suppliers?.shortName;

        data.push({
          id: item.id,
          date: item.date,
          numberBill: item.numberBill,
          organization: supplierName,
          supplyDate: item.expectedSupplyDate,
          vat: item.vat,
          amount: item.totalAmount,
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
