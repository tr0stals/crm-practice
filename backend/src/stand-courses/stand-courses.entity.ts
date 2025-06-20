import { Stands } from 'src/stands/stands.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StandCourses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
