import { EmployeeDepartments } from 'src/employee-departments/employee-departments.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Departments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    () => EmployeeDepartments,
    (employeeDepartment) => employeeDepartment.departments,
  )
  employeeDepartments: EmployeeDepartments[];
}
