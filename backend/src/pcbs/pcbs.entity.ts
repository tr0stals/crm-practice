import { PcbOrders } from 'src/pcb_orders/pcb_orders.entity';
import { Stands } from 'src/stands/stands.entity';
import { PcbsComponents } from '../pcbs_components/pcbs_components.entity';
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

  @Column({ nullable: true })
  parentId: number;

  @Column({ length: 100 })
  title: string;

  @ManyToOne(() => Stands, (stand) => stand.pcbs)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.pcb)
  pcbOrders: PcbOrders[];

  @OneToMany(() => PcbsComponents, (pcbsComponent) => pcbsComponent.pcb)
  pcbsComponents: PcbsComponents[];

  // Self-referencing для категорий/подкатегорий
  @ManyToOne(() => PCBS, (pcb) => pcb.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: PCBS;

  @OneToMany(() => PCBS, (pcb) => pcb.parent)
  children: PCBS[];

  // Метод для определения типа записи
  isCategory(): boolean {
    // Если заполнены только parentId и title, то это категория
    return !this.stands;
  }

  isPcb(): boolean {
    return !this.isCategory();
  }
}
