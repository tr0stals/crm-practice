import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TaskTypes } from '../task-types/task-types.entity';
import { Employees } from '../employees/employees.entity';
import { CurrentTasks } from '../current-tasks/current-tasks.entity';
import { Shipments } from 'src/shipments/shipments.entity';

@Entity()
export class EmployeeTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  timeout: string;

  @Column()
  expectationTimeout: Date;

  @ManyToOne(() => Employees, (employee) => employee.employeeTasks)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(() => Shipments, (shipment) => shipment.employeeTasks)
  @JoinColumn({ name: 'shipmentId' })
  shipments: Shipments;
}
