import { Stands } from 'src/stands/stands.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StandsTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45})
  title: string;

  @OneToMany(() => Stands, (stand) => stand.standType)
  stands: Stands[];
}
