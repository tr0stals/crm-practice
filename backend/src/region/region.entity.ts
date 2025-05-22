import { Countries } from 'src/countries/countries.entity';
import { Locations } from 'src/locations/locations.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToOne(() => Countries, (country) => country.regions)
  @JoinColumn({ name: 'countryId' })
  country: Countries;

  @OneToMany(() => Locations, (location) => location.region)
  locations: Locations[];
}
