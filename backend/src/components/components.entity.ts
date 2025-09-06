import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SupplierComponents } from '../supplier_components/supplier_components.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { ServerArrivals } from 'src/server_arrivals/server_arrivals.entity';
import { OrderRequestsComponents } from 'src/order_requests_components/order_requests_components.entity';
import { ComponentPlacements } from 'src/component_placements/component_placements.entity';
import { Inventarization } from 'src/inventarization/inventarization.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import { BillsComponents } from 'src/bills_components/bills_components.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { PcbsComponents } from 'src/pcbs_components/pcbs_components.entity';
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

  // Self-referencing для категорий/подкатегорий
  @ManyToOne(() => Components, (component) => component.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Components;

  @OneToMany(() => Components, (component) => component.parent)
  children: Components[];

  @OneToMany(
    () => BillsComponents,
    (billsComponent) => billsComponent.components,
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

  // Метод для определения типа записи
  isCategory(): boolean {
    // Если заполнены только parentId и title, то это категория
    return !this.photo && !this.width && !this.height && !this.thickness && 
           !this.weight && !this.material && !this.receiptDate && 
           !this.drawingReference && !this.componentPlacements;
  }

  isComponent(): boolean {
    return !this.isCategory();
  }
}
