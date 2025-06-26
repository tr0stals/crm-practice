import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StandTasks } from 'src/stand-tasks/stand-tasks.entity';
import { EmployeesProfessions } from 'src/employees-professions/employees-professions.entity';

@Entity()
export class Professions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => StandTasks, (standTask) => standTask.professions)
  standTasks: StandTasks[];

  @OneToMany(
    () => EmployeesProfessions,
    (employeeProfession) => employeeProfession.professions,
  )
  employeesProfessions: EmployeesProfessions[];
}
