import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { Professions } from 'src/professions/professions.entity';
import { Rights } from 'src/rights/rights.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
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
export class ProfessionRights {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professions, (profession) => profession.professionRights)
  @JoinColumn({ name: 'professionId' })
  professions: Professions;

  @ManyToOne(() => Rights, (right) => right.professionRights)
  @JoinColumn({ name: 'rightId' })
  rights: Rights;

  @OneToMany(
    () => EmployeesProfessions,
    (employeeProfession) => employeeProfession.professionRights,
  )
  employeeProfessions: EmployeesProfessions[];

  @OneToMany(() => StandTasks, (standTask) => standTask.professionRights)
  standTasks: StandTasks[];
}
