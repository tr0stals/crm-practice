import { PcbOrders } from 'src/pcb-orders/pcb-orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PcbOrderStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.pcbOrderState)
  pcbOrders: PcbOrders[];
}
