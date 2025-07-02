import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ComponentPlacementType } from '../component_placement_type/component_placement_type.entity';
import { Components } from 'src/components/components.entity';

@Entity()
export class ComponentPlacements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  building: string;

  @Column({ length: 45 })
  room: string;

  @ManyToOne(
    () => ComponentPlacementType,
    (type) => type.componentPlacementTypes,
  )
  @JoinColumn({ name: 'placementTypeId' })
  placementType: ComponentPlacementType;

  @OneToMany(() => Components, (component) => component.componentPlacements)
  components: Components[];
}
