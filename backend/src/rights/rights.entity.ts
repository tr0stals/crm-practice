import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rights {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    () => ProfessionRights,
    (professionRight) => professionRight.rights,
  )
  professionRights: ProfessionRights[];
}
