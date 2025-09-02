import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentsCategories } from './components_categories.entity';
import { ComponentsSubcategories } from './components_subcategories.entity';

@Injectable()
export class ComponentsCategoriesService {
  constructor(
    @InjectRepository(ComponentsCategories)
    private readonly catRepo: Repository<ComponentsCategories>,
    @InjectRepository(ComponentsSubcategories)
    private readonly subRepo: Repository<ComponentsSubcategories>,
  ) {}

  findAll() {
    return this.catRepo.find({ relations: ['subcategories'] });
  }

  async findOne(id: number) {
    const ent = await this.catRepo.findOne({
      where: { id },
      relations: ['subcategories'],
    });
    if (!ent) throw new NotFoundException('Категория не найдена');
    return ent;
  }

  createCategory(data: { name: string }) {
    return this.catRepo.save(this.catRepo.create(data));
  }

  async updateCategory(id: number, data: Partial<ComponentsCategories>) {
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

  async updateSubcategory(id: number, data: Partial<ComponentsSubcategories>) {
    await this.subRepo.update(id, data);
    return this.subRepo.findOne({ where: { id }, relations: ['category'] });
  }

  async deleteSubcategory(id: number) {
    await this.subRepo.delete(id);
  }
}


