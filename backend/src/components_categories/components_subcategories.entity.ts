import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComponentsCategories } from './components_categories.entity';
import { Components } from '../components/components.entity';

@Entity({ name: 'components_subcategories' })
export class ComponentsSubcategories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @ManyToOne(() => ComponentsCategories, (cat) => cat.subcategories)
  @JoinColumn({ name: 'categoryId' })
  category: ComponentsCategories;

  @OneToMany(() => Components, (c) => c.componentSubcategory)
  components: Components[];
}


