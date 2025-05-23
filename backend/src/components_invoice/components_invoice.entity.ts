import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ComponentsInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoiceId: number;

  @Column()
  componentId: number;

  @Column()
  quantity: number;
}