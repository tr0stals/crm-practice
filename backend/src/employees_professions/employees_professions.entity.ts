import { Employees } from 'src/employees/employees.entity';
import { Professions } from 'src/professions/professions.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeesProfessions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employees, (employee) => employee.employeesProfessions)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(() => Professions, (profession) => profession.employeesProfessions)
  @JoinColumn({ name: 'professionId' })
  professions: Professions;
}
