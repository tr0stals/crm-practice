import { Employees } from 'src/employees/employees.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Peoples {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  comment?: string;

  @Column({ nullable: true, type: 'date' })
  birthDate?: Date;

  @OneToMany(() => Employees, (employee) => employee.peoples)
  employees: Employees[];

  @OneToMany(() => Organizations, (organization) => organization.peoples)
  organizations: Organizations[];
}
