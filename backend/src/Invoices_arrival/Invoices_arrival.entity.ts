import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InvoicesArrival {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  providerId: number;

  @Column({ length: 255 })
  invoiceScan: string;
}