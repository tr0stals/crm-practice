import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ComponentPlacementType } from '../component_placement_type/component_placement_type.entity';

@Entity()
export class ComponentPlacements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  building: string;

  @Column({ length: 45 })
  room: string;

  @ManyToOne(() => ComponentPlacementType)
  @JoinColumn({ name: 'placementTypeId' })
  placementType: ComponentPlacementType;
} 