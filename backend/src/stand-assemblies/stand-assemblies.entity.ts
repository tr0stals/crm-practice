import { Shipments } from 'src/shipments/shipments.entity';
import { Stands } from 'src/stands/stands.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StandAssemblies {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stands, (stand) => stand.standAssemblies)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @OneToMany(() => Shipments, (shipment) => shipment.standAssemblies)
  shipments: Shipments[];
}
