import { PcbOrders } from 'src/pcb-orders/pcb-orders.entity';
import { PcbWarehouseComponents } from 'src/pcb-warehouse-components/pcb-warehouse-components.entity';
import { Stands } from 'src/stands/stands.entity';
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

  @ManyToOne(() => Stands, (stand) => stand.pcbs)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @OneToMany(() => PcbWarehouseComponents, (pwc) => pwc.pcbs)
  pcbWarehouseComponents: PcbWarehouseComponents[];

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.pcbs)
  pcbOrders: PcbOrders[];
}
