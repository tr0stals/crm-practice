import { PcbOrders } from 'src/pcb-orders/pcb-orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.orderTypes)
  pcbOrders: PcbOrders[];
}
