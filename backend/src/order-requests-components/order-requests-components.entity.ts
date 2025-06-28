import { OrderRequests } from 'src/order-requests/order-requests.entity';
import { Components } from 'src/components/components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OrderRequestsComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  componentCount: number;

  @Column({ length: 255 })
  link: string;

  @Column({ length: 45 })
  comment: string;

  @ManyToOne(() => OrderRequests, (orderReq) => orderReq.orderRequestsComponents)
  @JoinColumn({ name: 'orderRequestId' })
  orderRequests: OrderRequests;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'supplierId' })
  supplier: Organizations;
}
