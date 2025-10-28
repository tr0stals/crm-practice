import { PcbOrders } from 'src/pcb_orders/pcb_orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PcbOrderStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, unique: true })
  state: string;

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.pcbOrderState)
  pcbOrders: PcbOrders[];
}
