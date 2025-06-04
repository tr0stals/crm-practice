import { Organizations } from 'src/organizations/organizations.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrganizationTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    () => Organizations,
    (organization) => organization.organizationTypes,
  )
  organizations: Organizations[];
}
