import { ShipmentPackageStates } from 'src/shipment-package-states/shipment-package-states.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ShipmentPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column()
  photo: string;

  @ManyToOne(() => ShipmentPackageStates, (state) => state.shipmentPackages)
  @JoinColumn({ name: 'stateId' })
  shipmentPackageStates: ShipmentPackageStates;

  @ManyToOne(() => Shipments, (shipment) => shipment.shipmentPackages)
  @JoinColumn({ name: 'shipmentId' })
  shipments: Shipments;
}
