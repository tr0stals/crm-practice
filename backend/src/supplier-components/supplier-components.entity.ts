import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Suppliers } from '../suppliers/suppliers.entity';
import { Components } from '../components/components.entity';

@Entity()
export class SupplierComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplierId: number;

  @Column()
  componentId: number;

  @Column({ nullable: true })
  productUrl: string;

  @ManyToOne(() => Suppliers, supplier => supplier.supplierComponents)
  @JoinColumn({ name: 'supplierId' })
  supplier: Suppliers;

  @ManyToOne(() => Components, component => component.supplierComponents)
  @JoinColumn({ name: 'componentId' })
  component: Components;
} 