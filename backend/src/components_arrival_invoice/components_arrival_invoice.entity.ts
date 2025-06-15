import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Components } from '../components/components.entity';
import { InvoicesArrival } from '../Invoices_arrival/Invoices_arrival.entity';

@Entity()
export class ComponentsArrivalInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoiceId: number;

  @Column()
  componentId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Components, component => component.componentsArrivalInvoice)
  @JoinColumn({ name: 'componentId' })
  component: Components;

  @ManyToOne(() => InvoicesArrival, invoice => invoice.componentsArrivalInvoice)
  @JoinColumn({ name: 'invoiceId' })
  invoice: InvoicesArrival;
}