import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';

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
