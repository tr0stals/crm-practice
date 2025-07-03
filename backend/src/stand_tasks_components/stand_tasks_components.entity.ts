import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StandTasks } from '../stand_tasks/stand_tasks.entity';
import { Components } from '../components/components.entity';

@Entity()
export class StandTasksComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  componentCount: number;

  @ManyToOne(() => StandTasks)
  @JoinColumn({ name: 'standTaskId' })
  standTask: StandTasks;

  @ManyToOne(() => Components)
  @JoinColumn({ name: 'componentId' })
  component: Components;
}
