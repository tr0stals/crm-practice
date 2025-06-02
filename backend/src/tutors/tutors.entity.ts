import { Departments } from 'src/departments/departments.entity';
import { Groups } from 'src/groups/groups.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tutors {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tutors)
  @JoinColumn({ name: 'userId' })
  users: User;

  @ManyToOne(() => Departments, (dep) => dep.tutors)
  @JoinColumn({ name: 'departmentId' })
  departments: Departments;

  @OneToMany(() => Groups, (group) => group.tutors)
  groups: Groups[];

  @OneToMany(() => Shipments, (shipment) => shipment.tutors)
  shipments: Shipments[];
}
