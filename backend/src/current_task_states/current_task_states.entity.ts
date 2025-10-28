import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { CurrentTaskStatesLog } from 'src/current_task_states_log/current_task_states_log.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurrentTaskStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, unique: true })
  title: string;

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.currentTaskStates)
  currentTasks: CurrentTasks[];

  @OneToMany(() => CurrentTaskStatesLog, (log) => log.currentTaskState)
  currentTaskStatesLogs: CurrentTaskStatesLog[];
}
