import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';
import { Components } from '../components/components.entity';

@Entity()
export class CurrentTasksComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  componentCount: number;

  @Column()
  warehouseComponentCount: number;

  @ManyToOne(() => CurrentTasks)
  @JoinColumn({ name: 'currentTaskId' })
  currentTask: CurrentTasks;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;
}
