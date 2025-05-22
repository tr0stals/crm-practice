import { Organizations } from 'src/organizations/organizations.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrganizationTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Organizations, (organization) => organization.locations)
  organizations: Organizations[];
}
