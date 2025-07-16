import { Employees } from 'src/employees/employees.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EmployeesVacations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @ManyToOne(() => Employees, (employee) => employee.employeesVacations)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(() => Organizations, (org) => org.employeesVacations)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;
}
