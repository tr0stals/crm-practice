import { Departments } from 'src/departments/departments.entity';
import { Locations } from 'src/locations/locations.entity';
import { OrganizationTypes } from 'src/organization-types/organization-types.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Organizations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  comment: string;

  @ManyToOne(() => Locations, (location) => location.organizations)
  @JoinColumn({ name: 'locationId' })
  locations: Locations;

  @ManyToOne(() => OrganizationTypes, (orgType) => orgType.organizations)
  @JoinColumn({ name: 'organizationTypeId' })
  organizationTypes: OrganizationTypes;

  @OneToMany(() => Departments, (department) => department.organizations)
  departments: Departments[];
}
