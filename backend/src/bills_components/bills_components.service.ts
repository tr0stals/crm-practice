import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BillsComponents } from './bills_components.entity';
import { BillsForPay } from 'src/bills_for_pay/bills_for_pay.entity';
import { BillsComponentsDTO } from './dto/BillsComponentsDTO';
import { Components } from 'src/components/components.entity';
import { BillsForPayService } from 'src/bills_for_pay/bills_for_pay.service';
import { ComponentsService } from 'src/components/components.service';

@Injectable()
export class BillsComponentsService {
  constructor(
    @InjectRepository(BillsComponents)
    private readonly repo: Repository<BillsComponents>,
    @InjectRepository(BillsForPay)
    private readonly billsForPayRepo: Repository<BillsForPay>,
    @InjectRepository(Components)
    private readonly componentsRepo: Repository<Components>,
    private billsForPayService: BillsForPayService,
    private componentsService: ComponentsService,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['bill', 'components'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['bill', 'components'],
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
          const { bill, components, link, ...defaultData } = item;

          // if (!bill || !component)
          //   throw new Error('Нет объектов bill или components');

          return {
            ...defaultData,
            billData: bill?.date,
            billNumber: bill?.numberBill,
            componentTitle: components?.title,
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

      console.log('BILLLSSSS!', bills);
      bills.map((item) => {
        const { bill, components, link, ...defaultData } = item;
        // if (!bill || !component)
        //   throw new Error('Нет объектов bill или components');

        const billData = bill?.date;
        const billNumber = bill?.numberBill;
        const componentTitle = components?.title;

        data.push({
          ...defaultData,
          billData,
          billNumber,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: BillsComponentsDTO) {
    try {
      const { billId, componentId, ...defaultData } = data;
      const bill = await this.billsForPayService.getOne(billId);
      const component = await this.componentsService.findOne(componentId);

      if (!bill) throw new Error('Bill Не найден');
      if (!component) throw new Error('Component не найден');

      const entity = this.repo.create({
        ...defaultData,
        bill: bill,
        components: component,
      } as DeepPartial<BillsComponents>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<BillsComponents>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
