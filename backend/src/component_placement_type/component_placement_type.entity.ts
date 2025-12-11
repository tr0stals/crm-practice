import { ComponentPlacements } from 'src/component_placements/component_placements.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ComponentPlacementType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

  @OneToMany(
    () => ComponentPlacements,
    (componentPlacement) => componentPlacement.placementType,
  )
  componentPlacementTypes: ComponentPlacementType[];
}
