import { IsInt, IsNotEmpty } from 'class-validator';
import { License } from 'src/license/license.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { ShipmentPackage } from 'src/shipment_package/shipment_package.entity';
import { ShipmentTrips } from 'src/shipment_trips/shipment_trips.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Shipments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ type: 'date' })
  addedDate: Date;

  @Column({ type: 'date' })
  shipmentDate: Date;

  @Column({ type: 'date' })
  arrivalDate: Date;

  @Column({ type: 'json', nullable: true })
  specificationImage: string[];

  @Column({ nullable: true, length: 200 })
  comment: string;

  @OneToMany(
    () => ShipmentPackage,
    (shipmentPackage) => shipmentPackage.shipments,
  )
  shipmentPackages: ShipmentPackage[];

  @OneToOne(() => License, (license) => license.shipment, { nullable: true })
  @JoinColumn({ name: 'licenseId' })
  licenses?: License;

  @OneToMany(() => ShipmentTrips, (shipmentTrip) => shipmentTrip.shipments)
  shipmentTrips: ShipmentTrips[];

  @ManyToOne(
    () => Organizations,
    (organization) => organization.shipmentFactory,
  )
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @ManyToOne(() => Organizations, (organization) => organization.transporter)
  @JoinColumn({ name: 'transporterId' })
  transporter: Organizations;

  @ManyToOne(() => Organizations, (organization) => organization.client)
  @JoinColumn({ name: 'clientId' })
  client: Organizations;

  @OneToMany(() => ShipmentsStands, (shipmentStand) => shipmentStand.shipments)
  shipmentStands: ShipmentsStands[];
}
