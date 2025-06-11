import { OrderRequests } from 'src/order-requests/order-requests.entity';
import { WarehouseComponents } from 'src/warehouse-components/warehouse-components.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderRequestComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderRequests, (orderReq) => orderReq.orderRequestComponents)
  @JoinColumn({ name: 'orderRequestId' })
  orderRequests: OrderRequests;

  @ManyToOne(
    () => WarehouseComponents,
    (warehouseComponent) => warehouseComponent.orderRequestComponents,
  )
  @JoinColumn({ name: 'componentId' })
  components: OrderRequestComponents;
}
