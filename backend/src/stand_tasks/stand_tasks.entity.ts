import { Components } from 'src/components/components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { Professions } from 'src/professions/professions.entity';
import { Stands } from 'src/stands/stands.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StandTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @Column()
  order: number;

  @Column({ nullable: true })
  componentOutCount?: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 100, nullable: true })
  photo?: string;

  @Column({ type: 'int' })
  manufactureTime: number;

  @ManyToOne(() => Stands, (stand) => stand.standTasks)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @ManyToOne(() => Professions, (profession) => profession.standTasks)
  @JoinColumn({ name: 'professionId' })
  professions: Professions;

  @ManyToOne(() => Components, (component) => component.standTasks, {
    nullable: true,
  })
  @JoinColumn({ name: 'componentId' })
  components?: Components;

  @OneToMany(
    () => StandTasksComponents,
    (standTaskComponent) => standTaskComponent.standTask,
  )
  standTasksComponents: StandTasksComponents[];

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.standTasks)
  currentTasks: CurrentTasks[];
}
