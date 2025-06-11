import { Employees } from 'src/employees/employees.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeeStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Employees, (employee) => employee.employeeStates)
  employees: Employees[];
}
