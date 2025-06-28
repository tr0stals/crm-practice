import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organizations } from '../organizations/organizations.entity';
import { BillsComponents } from '../bills-components/bills-components.entity';

@Entity()
export class BillsForPay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 45 })
  scanPhoto: string;

  @Column({ type: 'date' })
  expectedSupplyDate: Date;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column()
  vat: boolean;

  @Column({ length: 45 })
  link: string;
  
  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'supplierId' })
  supplier: Organizations;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @OneToMany(() => BillsComponents, (billsComponent) => billsComponent.bill)
  billsComponents: BillsComponents[];
} 