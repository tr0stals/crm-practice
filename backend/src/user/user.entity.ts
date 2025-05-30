import { Students } from 'src/students/students.entity';
import { Tutors } from 'src/tutors/tutors.entity';
import { UserRoles } from 'src/user-roles/user-roles.entity';
import { Employees } from 'src/employees/employees.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  passwordSalt?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ nullable: true })
  middleName: string;

  @OneToMany(() => Tutors, (tutor) => tutor.users)
  tutors: Tutors[];

  @OneToMany(() => UserRoles, (userRoles) => userRoles.users)
  userRoles: UserRoles[];

  @OneToMany(() => Students, (student) => student.user)
  students: Students[];

  @OneToMany(() => Employees, (employee) => employee.user)
  employees: Employees[];
}
