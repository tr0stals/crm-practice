import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentInvoice } from './Payment_invoice.entity';

@Injectable()
export class PaymentInvoiceService {
  constructor(
    @InjectRepository(PaymentInvoice)
    private repository: Repository<PaymentInvoice>,
  ) {}

  async create(data: Partial<PaymentInvoice>): Promise<PaymentInvoice> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<PaymentInvoice[]> {
    return await this.repository.find({
      relations: ['supplier']
    });
  }

  async findOne(id: number): Promise<PaymentInvoice> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['supplier']
    });
    if (!entity) {
      throw new NotFoundException(`Счет на оплату с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<PaymentInvoice>): Promise<PaymentInvoice> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}