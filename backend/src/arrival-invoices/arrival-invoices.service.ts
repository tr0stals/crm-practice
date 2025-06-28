import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArrivalInvoices } from './arrival-invoices.entity';

@Injectable()
export class ArrivalInvoicesService {
  constructor(
    @InjectRepository(ArrivalInvoices)
    private readonly repo: Repository<ArrivalInvoices>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['suppliers', 'factory', 'invoicesComponents'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['suppliers', 'factory', 'invoicesComponents'] });
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
