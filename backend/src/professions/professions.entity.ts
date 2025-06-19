import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employees } from 'src/employees/employees.entity';

@Entity()
export class Professions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Employees, (employee) => employee.profession)
  employees: Employees[];
}
