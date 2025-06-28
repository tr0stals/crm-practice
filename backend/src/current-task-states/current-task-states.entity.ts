import { CurrentTasks } from 'src/current-tasks/current-tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurrentTaskStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45})
  title: string;

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.currentTaskStates)
  currentTasks: CurrentTasks[];
}
