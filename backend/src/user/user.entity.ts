import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employees } from 'src/employees/employees.entity';
import { NotificationUsers } from 'src/notification-users/notification-users.entity';

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

  @ManyToOne(() => Employees, (employee) => employee.users)
  @JoinColumn({ name: 'employeeId' })
  employees?: Employees;

  @OneToMany(() => NotificationUsers, (nu) => nu.users)
  notificationUsers: NotificationUsers[];
}
