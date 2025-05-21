import { Organizations } from 'src/organizations/organizations.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Departments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  comment: string;

  @ManyToOne(() => Organizations, (organization) => organization.departments)
  @JoinColumn({ name: 'organizationId' })
  organizations: Organizations;
}
