import { Region } from 'src/region/region.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
}
