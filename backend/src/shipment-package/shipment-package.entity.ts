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

  @Column({length: 100})
  width: string;

  @Column({length: 100})
  height: string;

  @Column({length: 100})
  thickness: string;

  @Column({length: 100})
  weight: string;

  @Column({nullable: true, length: 200})
  photo: string;

  @ManyToOne(() => ShipmentPackageStates, (state) => state.shipmentPackages)
  @JoinColumn({ name: 'stateId' })
  shipmentPackageStates: ShipmentPackageStates;

  @ManyToOne(() => Shipments, (shipment) => shipment.shipmentPackages)
  @JoinColumn({ name: 'shipmentId' })
  shipments: Shipments;
}
