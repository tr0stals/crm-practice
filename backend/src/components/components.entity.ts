import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Suppliers } from '../suppliers/suppliers.entity';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';
import { ComponentsArrivalInvoice } from '../components_arrival_invoice/components_arrival_invoice.entity';

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

  @OneToMany(() => SupplierComponents, supplierComponents => supplierComponents.component)
  supplierComponents: SupplierComponents[];

  @OneToMany(() => ComponentsArrivalInvoice, componentsArrivalInvoice => componentsArrivalInvoice.component)
  componentsArrivalInvoice: ComponentsArrivalInvoice[];
} 