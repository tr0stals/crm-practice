import { Students } from 'src/students/students.entity';
import { Tutors } from 'src/tutors/tutors.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Tutors, (tutor) => tutor.groups)
  @JoinColumn({ name: 'tutorId' })
  tutors: Tutors;

  @OneToMany(() => Students, (student) => student.groups)
  students: Students[];
}
