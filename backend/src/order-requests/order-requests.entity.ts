import { Employees } from 'src/employees/employees.entity';
import { OrderRequestComponents } from 'src/order-request-components/order-request-components.entity';
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
export class OrderRequests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: number;

  @Column()
  title: string;

  @Column()
  article: string;

  @Column()
  count: number;

  @Column()
  priceForPcs: number;

  @Column()
  link: string;

  @Column()
  comment: string;

  @ManyToOne(() => Stands, (stand) => stand.orderRequests)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @ManyToOne(() => Employees, (employee) => employee.creator)
  @JoinColumn({ name: 'employeeCreatorId' })
  employeeCreator: Employees;

  @ManyToOne(() => Employees, (employee) => employee.executor)
  @JoinColumn({ name: 'employeeExecutorId' })
  employeeExecutor: Employees;

  @OneToMany(
    () => OrderRequestComponents,
    (component) => component.orderRequests,
  )
  orderRequestComponents: OrderRequestComponents;
}
