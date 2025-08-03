import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';

@Entity()
export class Professions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => StandTasks, (standTask) => standTask.professionRights)
  standTasks: StandTasks[];

  @OneToMany(
    () => ProfessionRights,
    (professionRight) => professionRight.professions,
  )
  professionRights: ProfessionRights[];
}
