import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillsComponents } from './bills_components.entity';
import { BillsForPay } from 'src/bills_for_pay/bills_for_pay.entity';

@Injectable()
export class BillsComponentsService {
  constructor(
    @InjectRepository(BillsComponents)
    private readonly repo: Repository<BillsComponents>,
    @InjectRepository(BillsForPay)
    private readonly billsForPayRepo: Repository<BillsForPay>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['bill', 'component'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['bill', 'component'],
    });
  }

  async generateDataById(incomingId: number) {
    try {
      const bills = await this.getAll();

      if (!bills)
        throw new NotFoundException('Ошибка при поиске bills-components');

      const data = bills
        .filter((item) => item.bill?.id === incomingId)
        .map((item) => {
          const { bill, component, link, ...defaultData } = item;
          return {
            ...defaultData,
            billData: bill.date,
            componentTitle: component.title,
          };
        });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const bills = await this.getAll();
      const data: any[] = [];

      if (!bills)
        throw new NotFoundException('Ошибка при поиске bills-components');

      bills.map((item) => {
        const { bill, component, link, ...defaultData } = item;

        const billData = bill.date;
        const componentTitle = component.title;

        data.push({
          ...defaultData,
          billData,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<BillsComponents>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<BillsComponents>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
