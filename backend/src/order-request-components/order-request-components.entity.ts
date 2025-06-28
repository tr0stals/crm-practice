import { Components } from 'src/components/components.entity';
import { OrderRequests } from 'src/order-requests/order-requests.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderRequestComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderRequests, (orderReq) => orderReq.orderRequestComponents)
  @JoinColumn({ name: 'orderRequestId' })
  orderRequests: OrderRequests;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;
}