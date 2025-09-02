import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbsCategories } from './pcbs_categories.entity';
import { PcbsSubcategories } from './pcbs_subcategories.entity';

@Injectable()
export class PcbsCategoriesService {
  constructor(
    @InjectRepository(PcbsCategories)
    private readonly catRepo: Repository<PcbsCategories>,
    @InjectRepository(PcbsSubcategories)
    private readonly subRepo: Repository<PcbsSubcategories>,
  ) {}

  findAll() {
    return this.catRepo.find({ relations: ['subcategories'] });
  }

  async findOne(id: number) {
    const ent = await this.catRepo.findOne({ where: { id }, relations: ['subcategories'] });
    if (!ent) throw new NotFoundException('Категория ПП не найдена');
    return ent;
  }

  createCategory(data: { name: string }) {
    return this.catRepo.save(this.catRepo.create(data));
  }

  async updateCategory(id: number, data: Partial<PcbsCategories>) {
    await this.catRepo.update(id, data);
    return this.findOne(id);
  }

  async deleteCategory(id: number) {
    await this.catRepo.delete(id);
  }

  // Subcategories
  listSubcategories() {
    return this.subRepo.find({ relations: ['category'] });
  }

  createSubcategory(data: { name: string; categoryId: number }) {
    return this.subRepo.save(
      this.subRepo.create({ name: data.name, category: { id: data.categoryId } as any }),
    );
  }

  async updateSubcategory(id: number, data: Partial<PcbsSubcategories>) {
    await this.subRepo.update(id, data);
    return this.subRepo.findOne({ where: { id }, relations: ['category'] });
  }

  async deleteSubcategory(id: number) {
    await this.subRepo.delete(id);
  }
}


