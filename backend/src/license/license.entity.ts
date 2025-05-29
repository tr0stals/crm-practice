import { UUID } from 'crypto';
import { LicenseTypes } from 'src/license-types/license-types.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licenseCode: UUID;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column()
  state: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  places: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => LicenseTypes, (licenseType) => licenseType.licenseTypes)
  @JoinColumn({ name: 'licenseTypeId' })
  licenseTypes: LicenseTypes;

  @ManyToOne(() => Shipments, (shipment) => shipment.licenses)
  @JoinColumn({ name: 'shipmentId' })
  shipments: Shipments;
}
