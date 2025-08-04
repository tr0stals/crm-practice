import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';
import { CurrentTaskStates } from '../current_task_states/current_task_states.entity';

@Entity()
export class CurrentTaskStatesLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  dateTime: Date;

  @ManyToOne(() => CurrentTasks)
  @JoinColumn({ name: 'currentTaskId' })
  currentTask: CurrentTasks;

  @ManyToOne(() => CurrentTaskStates)
  @JoinColumn({ name: 'currentTaskStateId' })
  currentTaskState: CurrentTaskStates;
} 