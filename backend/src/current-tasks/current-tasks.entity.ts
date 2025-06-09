import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmployeeTasks } from '../employee-tasks/employee-tasks.entity';

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  WAITING_COMPONENTS = 'WAITING_COMPONENTS',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class CurrentTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus;
}
