import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { Components } from 'src/components/components.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class InvoicesComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  componentCount: string;

  @ManyToOne(
    () => ArrivalInvoices,
    (arrivalInvoice) => arrivalInvoice.invoicesComponents,
  )
  @JoinColumn({ name: 'arrivalInvoiceId' })
  arrivalInvoices: ArrivalInvoices;

  @ManyToOne(() => Components, (component) => component.invoicesComponents)
  @JoinColumn({ name: 'componentId' })
  components: Components;
}
