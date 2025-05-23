import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmployeeTasks } from '../employee-tasks/employee-tasks.entity';

@Entity()
export class TaskTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => EmployeeTasks, employeeTask => employeeTask.taskType)
  employeeTasks: EmployeeTasks[];
} 