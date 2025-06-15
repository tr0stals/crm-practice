import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Suppliers } from '../suppliers/suppliers.entity';
import { ComponentsArrivalInvoice } from '../components_arrival_invoice/components_arrival_invoice.entity';

@Entity()
export class InvoicesArrival {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplierId: number;

  @Column()
  number: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  comment: string;

  @ManyToOne(() => Suppliers, supplier => supplier.invoicesArrival)
  @JoinColumn({ name: 'supplierId' })
  supplier: Suppliers;

  @OneToMany(() => ComponentsArrivalInvoice, componentsArrivalInvoice => componentsArrivalInvoice.invoice)
  componentsArrivalInvoice: ComponentsArrivalInvoice[];
}