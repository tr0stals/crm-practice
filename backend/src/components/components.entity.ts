import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';
import { StandTasks } from 'src/stand-tasks/stand-tasks.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { ServerWriteoff } from 'src/server-writeoff/server-writeoff.entity';
import { InvoicesComponents } from 'src/invoices-components/invoices-components.entity';
import { ServerArrivals } from 'src/server-arrivals/server-arrivals.entity';
import { OrderRequestsComponents } from 'src/order-requests-components/order-requests-components.entity';
import { ComponentPlacements } from 'src/component_placements/component_placements.entity';

@Entity()
export class Components {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ length: 45 })
  title: string;

  @Column({ length: 45, nullable: true })
  photo: string;

  @Column({ type: 'float', nullable: true })
  width: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  thickness: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ length: 45, nullable: true })
  material: string;

  @Column({ nullable: true, type: 'date' })
  receiptDate: Date;

  @Column({ nullable: true })
  drawingReference: string;

  @ManyToOne(() => ComponentPlacements)
  @JoinColumn({ name: 'placementId' })
  placement: ComponentPlacements;

  @OneToMany(
    () => SupplierComponents,
    (supplierComponents) => supplierComponents.component,
  )
  supplierComponents: SupplierComponents[];

  @OneToMany(() => StandTasks, (standTask) => standTask.components)
  standTasks: StandTasks[];

  @OneToMany(() => Writeoff, (writeoff) => writeoff.components)
  writeoffs: Writeoff[];

  @OneToMany(
    () => ServerWriteoff,
    (serverWriteoff) => serverWriteoff.components,
  )
  serverWriteoffs: ServerWriteoff[];

  @OneToMany(
    () => InvoicesComponents,
    (invoiceComponent) => invoiceComponent.components,
  )
  invoicesComponents: InvoicesComponents[];

  @OneToMany(() => ServerArrivals, (serverArrival) => serverArrival.components)
  serverArrivals: ServerArrivals[];

  @OneToMany(
    () => OrderRequestsComponents,
    (orderRequestsComponent) => orderRequestsComponent.component,
  )
  orderRequestsComponents: OrderRequestsComponents[];
}
