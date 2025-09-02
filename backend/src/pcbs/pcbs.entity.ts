import { PcbOrders } from 'src/pcb_orders/pcb_orders.entity';
import { Stands } from 'src/stands/stands.entity';
import { Components } from '../components/components.entity';
import { PcbsComponents } from '../pcbs_components/pcbs_components.entity';
import { PcbsSubcategories } from '../pcbs_categories/pcbs_subcategories.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PCBS {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @Column({ length: 100 })
  title: string;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;

  @ManyToOne(() => Stands, (stand) => stand.pcbs)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.pcb)
  pcbOrders: PcbOrders[];

  @OneToMany(() => PcbsComponents, (pcbsComponent) => pcbsComponent.pcb)
  pcbsComponents: PcbsComponents[];

  @ManyToOne(() => PcbsSubcategories, (sub) => sub.pcbs)
  @JoinColumn({ name: 'parentId' })
  pcbSubcategory: PcbsSubcategories;
}
