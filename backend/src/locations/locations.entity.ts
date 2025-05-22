import e from 'express';
import { Organizations } from 'src/organizations/organizations.entity';
import { Region } from 'src/region/region.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Locations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  timeZone: string;

  @ManyToOne(() => Region, (region) => region.locations)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @OneToMany(() => Organizations, (organization) => organization.locations)
  organizations: Organizations[];
}
