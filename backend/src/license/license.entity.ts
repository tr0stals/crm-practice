import { LicenseTypes } from 'src/license_types/license_types.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import { Stands } from 'src/stands/stands.entity';
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

  @Column({ length: 45 })
  licenseCode: string;

  @Column({ type: 'date' })
  start: Date;

  @Column({ type: 'date' })
  end: Date;

  @Column()
  places: number;

  @Column({ type: 'date' })
  timeout: Date;

  @Column({ length: 45 })
  comment: string;

  @ManyToOne(() => LicenseTypes, (licenseType) => licenseType.licenses)
  @JoinColumn({ name: 'licenseTypeId' })
  licenseTypes: LicenseTypes;

  @ManyToOne(() => Stands, (stand) => stand.licenses)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @OneToOne(() => Shipments, (shipment) => shipment.licenses)
  shipment: Shipments[];
}
