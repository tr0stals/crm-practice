import { Max } from 'class-validator';
import { Components } from 'src/components/components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ServerWriteoff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateTime: Date;

  @Column()
  @Max(45)
  componentCount: string;

  @ManyToOne(() => Components, (component) => component.serverWriteoffs)
  @JoinColumn({ name: 'componentId' })
  components: Components;

  @ManyToOne(() => Organizations, (org) => org.serverWriteoffs)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @ManyToOne(() => CurrentTasks, (currentTask) => currentTask.serverWriteoffs)
  @JoinColumn({ name: 'currentTaskId' })
  currentTasks: CurrentTasks;
}
