import { InvoicesComponents } from 'src/invoices-components/invoices-components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ArrivalInvoices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  scanPhoto: string;

  @Column()
  dateTimeToWarehouse: Date;

  @Column()
  price: number;

  @Column()
  vat: boolean;

  @ManyToOne(() => Organizations, (org) => org.arrivalInvoicesSupplier)
  @JoinColumn({ name: 'supplierId' })
  suppliers: Organizations;

  @ManyToOne(() => Organizations, (org) => org.arrivalInvoicesFactory)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @OneToMany(
    () => InvoicesComponents,
    (invoiceComponent) => invoiceComponent.arrivalInvoices,
  )
  invoicesComponents: InvoicesComponents[];
}
