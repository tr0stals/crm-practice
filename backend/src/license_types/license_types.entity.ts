import { License } from 'src/license/license.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LicenseTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  title: string;

  @OneToMany(() => License, (license) => license.licenseTypes)
  licenses: License[];
}
