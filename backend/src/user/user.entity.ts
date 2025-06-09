import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Peoples } from 'src/peoples/peoples.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  passwordSalt?: string;

  @ManyToOne(() => Peoples, (people) => people.users)
  @JoinColumn({ name: 'peopleId' })
  peoples: Peoples;
}
