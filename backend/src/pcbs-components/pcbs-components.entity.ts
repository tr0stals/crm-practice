import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PCBS } from '../pcbs/pcbs.entity';
import { Components } from '../components/components.entity';

@Entity()
export class PcbsComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  componentCount: number;

  @ManyToOne(() => PCBS, (pcb) => pcb.pcbsComponents)
  @JoinColumn({ name: 'pcbId' })
  pcb: PCBS;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;
} 