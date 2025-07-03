import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Components } from '../components/components.entity';

@Entity()
export class SupplierComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  componentId: number;

  @Column({ nullable: true })
  productUrl: string;

  @ManyToOne(() => Components, component => component.supplierComponents)
  @JoinColumn({ name: 'componentId' })
  component: Components;
} 