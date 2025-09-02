import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PcbsCategories } from './pcbs_categories.entity';
import { PCBS } from '../pcbs/pcbs.entity';

@Entity({ name: 'pcbs_subcategories' })
export class PcbsSubcategories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @ManyToOne(() => PcbsCategories, (cat) => cat.subcategories)
  @JoinColumn({ name: 'categoryId' })
  category: PcbsCategories;

  @OneToMany(() => PCBS, (p) => p.pcbSubcategory)
  pcbs: PCBS[];
}


