import { LicenseTypes } from 'src/license-types/license-types.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licenseCode: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  places: number;

  @Column()
  timeout: Date;

  @Column()
  comment: string;

  @ManyToOne(() => LicenseTypes, (licenseType) => licenseType.licenses)
  @JoinColumn({ name: 'licenseTypeId' })
  licenseTypes: LicenseTypes;

  @OneToOne(() => Shipments, (shipment) => shipment.licenses)
  shipments: Shipments[];
}
