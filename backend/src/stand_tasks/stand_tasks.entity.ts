import { Components } from 'src/components/components.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';
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

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @Column()
  order: number;

  @Column()
  componentOutCount: number;

  @Column({ length: 45 })
  title: string;

  @Column({ length: 100 })
  photo: string;

  @Column({ type: 'date' })
  manufactureTime: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Stands, (stand) => stand.standTasks)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @ManyToOne(
    () => ProfessionRights,
    (professionRight) => professionRight.standTasks,
  )
  @JoinColumn({ name: 'professionRightId' })
  professionRights: ProfessionRights;

  @ManyToOne(() => Components, (component) => component.standTasks)
  @JoinColumn({ name: 'componentId' })
  components: Components;

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.standTasks)
  currentTasks: CurrentTasks[];
}
