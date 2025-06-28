import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillsForPay } from './bills-for-pay.entity';

@Injectable()
export class BillsForPayService {
  constructor(
    @InjectRepository(BillsForPay)
    private readonly repo: Repository<BillsForPay>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['supplier', 'factory', 'billsComponents'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['supplier', 'factory', 'billsComponents'] });
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