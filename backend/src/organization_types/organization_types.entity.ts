import { Images } from 'src/images/images.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrganizationTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ length: 45, unique: true })
  title: string;

  @OneToMany(
    () => Organizations,
    (organization) => organization.organizationTypes,
  )
  organizations: Organizations[];
}
