import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';

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

  @ManyToOne(() => Professions, (profession) => profession.users)
  @JoinColumn({ name: 'professionId' })
  profession: Professions;

  @ManyToOne(() => Peoples, (people) => people.users)
  @JoinColumn({ name: 'peopleId' })
  peoples: Peoples;
}
