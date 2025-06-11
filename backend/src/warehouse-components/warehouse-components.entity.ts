import { OrderRequestComponents } from 'src/order-request-components/order-request-components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { PcbWarehouseComponents } from 'src/pcb-warehouse-components/pcb-warehouse-components.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WarehouseComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @Column()
  title: string;

  @Column()
  photo: string;

  @Column()
  price: number;

  @Column()
  count: number;

  @Column()
  size: string;

  @Column()
  weight: string;

  @Column()
  material: string;

  @Column()
  minCount: string;

  @Column()
  arrivalDate: Date;

  @Column()
  link: string;

  @ManyToOne(
    () => Organizations,
    (organization) => organization.warehouseComponents,
  )
  @JoinColumn({ name: 'factoryId' })
  organizations: Organizations;

  @OneToMany(() => OrderRequestComponents, (component) => component.components)
  orderRequestComponents: OrderRequestComponents[];

  @OneToMany(() => PcbWarehouseComponents, (pwc) => pwc.warehouseComponents)
  pcbWarehouseComponents: PcbWarehouseComponents[];
}
