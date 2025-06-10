import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employees } from 'src/employees/employees.entity';
import { User } from 'src/user/user.entity';


@Entity()
export class Professions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => User, (user) => user.profession)
  users: User[];

  @OneToMany(() => Employees, (employee) => employee.profession)
  employees: Employees[];
}
