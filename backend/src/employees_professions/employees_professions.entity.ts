import { Employees } from 'src/employees/employees.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';
import { Professions } from 'src/professions/professions.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeesProfessions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employees, (employee) => employee.employeesProfessions)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(
    () => ProfessionRights,
    (professionRight) => professionRight.employeeProfessions,
  )
  @JoinColumn({ name: 'professionRightsId' })
  professionRights: ProfessionRights;
}
