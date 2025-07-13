import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillsForPay } from '../bills_for_pay/bills_for_pay.entity';
import { Components } from '../components/components.entity';

@Entity()
export class BillsComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  componentCount: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ length: 255 })
  link: string;

  @ManyToOne(() => BillsForPay, (bill) => bill.billsComponents)
  @JoinColumn({ name: 'billId' })
  bill: BillsForPay;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;
}
