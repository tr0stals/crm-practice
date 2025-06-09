import { Departments } from 'src/departments/departments.entity';
import { Employees } from 'src/employees/employees.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeeDepartments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Departments, (department) => department.employeeDepartments)
  @JoinColumn({ name: 'departmentId' })
  departments: Departments;

  @ManyToOne(() => Employees, (employee) => employee.employeeDepartments)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;
}
