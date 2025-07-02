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
import { OrderRequestComponents } from 'src/order-request-components/order-request-components.entity';
import { Inventarization } from 'src/inventarization/inventarization.entity';
import { StandTasksComponents } from 'src/stand-tasks-components/stand-tasks-components.entity';
import { BillsComponents } from 'src/bills-components/bills-components.entity';
import { CurrentTasksComponents } from 'src/current-tasks-components/current-tasks-components.entity';
import { PcbsComponents } from 'src/pcbs-components/pcbs-components.entity';
import { PCBS } from 'src/pcbs/pcbs.entity';

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

  @ManyToOne(() => ComponentPlacements, (placement) => placement.components)
  @JoinColumn({ name: 'placementId' })
  componentPlacements: ComponentPlacements;

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

  @OneToMany(() => PCBS, (pcb) => pcb.component)
  pcbs: PCBS[];

  @OneToMany(() => PcbsComponents, (pcbsComponent) => pcbsComponent.component)
  pcbsComponents: PcbsComponents[];

  @OneToMany(
    () => BillsComponents,
    (billsComponent) => billsComponent.component,
  )
  billsComponents: BillsComponents[];

  @OneToMany(
    () => CurrentTasksComponents,
    (currentTasksComponent) => currentTasksComponent.component,
  )
  currentTasksComponents: CurrentTasksComponents[];

  @OneToMany(
    () => StandTasksComponents,
    (standTasksComponent) => standTasksComponent.component,
  )
  standTasksComponents: StandTasksComponents[];

  @OneToMany(
    () => Inventarization,
    (inventarization) => inventarization.component,
  )
  inventarizations: Inventarization[];

  @OneToMany(
    () => OrderRequestComponents,
    (orderRequestComponent) => orderRequestComponent.component,
  )
  orderRequestComponents: OrderRequestComponents[];
}
