import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComponentsSubcategories } from './components_subcategories.entity';

@Entity({ name: 'components_categories' })
export class ComponentsCategories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => ComponentsSubcategories, (sub) => sub.category, {
    cascade: ['insert', 'update'],
  })
  subcategories: ComponentsSubcategories[];
}


