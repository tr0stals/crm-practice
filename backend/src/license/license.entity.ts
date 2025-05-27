import { UUID } from 'crypto';
import { LicenseTypes } from 'src/license-types/license-types.entity';
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

  @ManyToOne(() => LicenseTypes, (licenseType) => licenseType.licenseTypes)
  @JoinColumn({ name: 'licenseTypeId' })
  licenseTypes: LicenseTypes;

  @Column()
  shipmentId: number;

  @Column()
  licenseCode: UUID;

  @Column()
  startDate: Date;

  @Column()
  expirationDate: Date;

  @Column()
  state: number;

  @Column()
  price: number;

  @Column()
  places: number;

  @Column()
  comment: string;
}
