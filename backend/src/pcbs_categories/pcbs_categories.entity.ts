import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PcbsSubcategories } from './pcbs_subcategories.entity';

@Entity({ name: 'pcbs_categories' })
export class PcbsCategories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => PcbsSubcategories, (sub) => sub.category, {
    cascade: ['insert', 'update'],
  })
  subcategories: PcbsSubcategories[];
}


