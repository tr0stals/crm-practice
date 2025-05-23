import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TaskTypes } from '../task-types/task-types.entity';
import { Employees } from '../employees/employees.entity';
import { CurrentTasks } from '../current-tasks/current-tasks.entity';

@Entity()
export class EmployeeTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ nullable: true })
  standId: number;

  @Column()
  employeeId: number;

  @Column()
  taskTypeId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  requiredTime: number; // в минутах

  @Column()
  expectedCompletionDate: Date;

  @ManyToOne(() => TaskTypes, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'taskTypeId' })
  taskType: TaskTypes;

  @ManyToOne(() => Employees)
  @JoinColumn({ name: 'employeeId' })
  employee: Employees;

  @OneToMany(() => CurrentTasks, currentTask => currentTask.task)
  currentTasks: CurrentTasks[];
} 