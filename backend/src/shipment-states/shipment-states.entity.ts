import { Shipments } from 'src/shipments/shipments.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShipmentStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Shipments, (shipment) => shipment.shipmentStates)
  shipments: Shipments[];
}
