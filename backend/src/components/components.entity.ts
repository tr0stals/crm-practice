import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Suppliers } from '../suppliers/suppliers.entity';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';
import { ComponentsArrivalInvoice } from '../components_arrival_invoice/components_arrival_invoice.entity';
import { StandTasks } from 'src/stand-tasks/stand-tasks.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { ServerWriteoff } from 'src/server-writeoff/server-writeoff.entity';
import { InvoicesArrival } from 'src/Invoices_arrival/Invoices_arrival.entity';
import { InvoicesComponents } from 'src/invoices-components/invoices-components.entity';
import { ServerArrivals } from 'src/server-arrivals/server-arrivals.entity';

@Entity()
export class Components {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  appearance: string; // Путь к фото или описание внешнего вида

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  material: string;

  @Column()
  minimumStock: number;

  @Column({ nullable: true })
  supplierId: number;

  @Column({ nullable: true })
  invoiceId: number;

  @Column({ nullable: true, type: 'date' })
  receiptDate: Date;

  @Column({ nullable: true })
  drawingReference: string;

  @ManyToOne(() => Suppliers, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'supplierId' })
  supplier: Suppliers;

  @OneToMany(
    () => SupplierComponents,
    (supplierComponents) => supplierComponents.component,
  )
  supplierComponents: SupplierComponents[];

  @OneToMany(
    () => ComponentsArrivalInvoice,
    (componentsArrivalInvoice) => componentsArrivalInvoice.component,
  )
  componentsArrivalInvoice: ComponentsArrivalInvoice[];

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
}
