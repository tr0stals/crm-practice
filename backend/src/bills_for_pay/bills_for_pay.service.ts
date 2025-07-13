import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillsForPay } from './bills_for_pay.entity';
import { BillsComponents } from '../bills_components/bills_components.entity';

@Injectable()
export class BillsForPayService {
  constructor(
    @InjectRepository(BillsForPay)
    private readonly repo: Repository<BillsForPay>,
    @InjectRepository(BillsComponents)
    private readonly billsComponentsRepo: Repository<BillsComponents>,
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
        const factoryName = factory?.shortName;
        const supplierName = supplier?.shortName;

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

  async getBillsForPayTree() {
    // Получаем все счета с нужными связями и их компоненты
    const bills = await this.repo.find({
      relations: ['suppliers', 'factory', 'billsComponents', 'billsComponents.components'],
      order: { date: 'DESC' },
    });

    console.log('Bills with components:', bills.map(bill => ({
      id: bill.id,
      numberBill: bill.numberBill,
      componentsCount: bill.billsComponents?.length || 0
    })));

    // Группируем по дате
    const grouped = {};
    for (const bill of bills) {
      const date = bill.date ? String(bill.date) : 'Без даты';
      if (!grouped[date]) grouped[date] = [];

      const supplierName = bill.suppliers?.shortName || 'Поставщик не указан';
      const expectedSupplyDate = bill.expectedSupplyDate ? String(bill.expectedSupplyDate) : 'Дата не указана';
      const vatText = bill.vat ? 'Да' : 'Нет';
      const amount = `${bill.totalAmount} руб.`;

      // Получаем компоненты для этого счета
      const billComponents = bill.billsComponents || [];

      const billObj = {
        id: bill.id,
        name: [
          `Номер счета: ${bill.numberBill}`,
          `Поставщик: ${supplierName}`,
          `Дата поставки: ${expectedSupplyDate}`,
          `НДС: ${vatText}`,
          `Сумма: ${amount}`,
        ].join(' | '),
        nodeType: 'bills_for_pay',
        numberBill: bill.numberBill,
        supplierName,
        expectedSupplyDate,
        vat: bill.vat,
        totalAmount: bill.totalAmount,
        children: billComponents.map(component => ({
          id: component.id,
          name: [
            component.components?.title || 'Компонент не указан',
            `Кол-во: ${component.componentCount}`,
            `Цена: ${component.price} руб.`,
          ].join(' | '),
          nodeType: 'bills_components',
          componentTitle: component.components?.title,
          componentCount: component.componentCount,
          price: component.price,
          link: component.link,
          children: [],
        })),
      };

      grouped[date].push(billObj);
    }

    // Формируем объект для TreeView
    return {
      name: 'Счета к оплате',
      children: Object.entries(grouped).map(([date, bills]) => ({
        name: date,
        children: (bills as any[]).map((billObj) => ({
          ...billObj,
        })),
      })),
    };
  }
}
