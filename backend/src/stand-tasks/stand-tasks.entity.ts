import { Components } from 'src/components/components.entity';
import { CurrentTasks } from 'src/current-tasks/current-tasks.entity';
import { Professions } from 'src/professions/professions.entity';
import { Stands } from 'src/stands/stands.entity';
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

  @Column()
  parentId: number;

  @Column()
  order: number;

  @Column()
  componentOutCount: number;

  @Column({ length: 45})
  title: string;

  @Column({ length: 100})
  photo: string;

  @Column({ type: 'date'})
  manufactureTime: Date;

  @ManyToOne(() => Stands, (stand) => stand.standTasks)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @ManyToOne(() => Professions, (profession) => profession.standTasks)
  @JoinColumn({ name: 'professionId' })
  professions: Professions;

  @ManyToOne(() => Components, (component) => component.standTasks)
  @JoinColumn({ name: 'componentId' })
  components: Components;

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.standTasks)
  currentTasks: CurrentTasks[];
}
