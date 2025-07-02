import { CurrentTasks } from 'src/current-tasks/current-tasks.entity';
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
export class ShipmentsStands {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipments, (shipment) => shipment.shipmentStands)
  @JoinColumn({ name: 'shipmentId' })
  shipments: Shipments;

  @ManyToOne(() => Stands, (stand) => stand.shipmentsStands)
  @JoinColumn({ name: 'standId' })
  stands: Stands;
}
