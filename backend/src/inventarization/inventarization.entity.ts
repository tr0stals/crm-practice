import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Components } from '../components/components.entity';
import { Organizations } from '../organizations/organizations.entity';

@Entity()
export class Inventarization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  inventarizationDate: Date;

  @Column({ type: 'int' })
  componentCount: number;

  @Column({ type: 'int' })
  inventarizationQuality: number;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;
} 