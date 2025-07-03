import { Employees } from 'src/employees/employees.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { OrderRequestsComponents } from 'src/order_requests_components/order_requests_components.entity';
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

  @Column({ length: 45 })
  title: string;

  @Column({ type: 'date' })
  requestDatetime: Date;

  @Column({ type: 'date' })
  executionDatetime: Date;

  @Column({ length: 45 })
  comment: string;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @ManyToOne(() => Stands, (stand) => stand.orderRequests)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

  @ManyToOne(() => Employees, (employee) => employee.creator)
  @JoinColumn({ name: 'employeeCreatorId' })
  employeeCreator: Employees;

  @OneToMany(
    () => OrderRequestsComponents,
    (orderRequestsComponents) => orderRequestsComponents.orderRequests,
  )
  orderRequestsComponents: OrderRequestsComponents[];
}
