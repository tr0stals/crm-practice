import { OrganizationTypes } from 'src/organization-types/organization-types.entity';
import { PcbOrders } from 'src/pcb-orders/pcb-orders.entity';
import { Peoples } from 'src/peoples/peoples.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import { WarehouseComponents } from 'src/warehouse-components/warehouse-components.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Organizations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: string;

  @Column()
  fullName: string;

  @Column()
  shortName: string;

  @Column()
  lawAddress: string;

  @Column()
  factAddress: string;

  @Column()
  postAddress: string;

  @Column()
  inn: string;

  @Column()
  kpp: string;

  @Column()
  orgn: string;

  @Column({ type: 'date' })
  orgnDate: Date;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  digitalDocs: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => Peoples, (people) => people.organizations)
  @JoinColumn({ name: 'contactPeopleId' })
  peoples: Peoples;

  @ManyToOne(
    () => OrganizationTypes,
    (organizationType) => organizationType.organizations,
  )
  @JoinColumn({ name: 'organzationTypeId' })
  organizationTypes: OrganizationTypes;

  @OneToMany(() => Shipments, (shipment) => shipment.factory)
  shipmentFactory: Shipments[];

  @OneToMany(() => Shipments, (shipment) => shipment.transporter)
  transporter: Shipments[];

  @OneToMany(() => Shipments, (shipment) => shipment.client)
  client: Shipments[];

  @OneToMany(() => WarehouseComponents, (warehouse) => warehouse.organizations)
  warehouseComponents: WarehouseComponents[];

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.manufacturer)
  pcbManufacturer: PcbOrders[];

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.factory)
  pcbFactory: PcbOrders[];
}
