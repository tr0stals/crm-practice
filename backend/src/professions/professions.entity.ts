import { Employees } from 'src/employees/employees.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Professions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Employees, (employee) => employee.professions)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;
}
