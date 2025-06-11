import { Employees } from 'src/employees/employees.entity';
import { OrderTypes } from 'src/order-types/order-types.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { PcbOrderStates } from 'src/pcb-order-states/pcb-order-states.entity';
import { PCBS } from 'src/pcbs/pcbs.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PcbOrders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billNumber: number;

  @Column()
  count: string;

  @Column()
  size: string;

  @Column()
  thickness: number;

  @Column()
  article: string;

  @Column()
  price: string;

  @ManyToOne(() => PCBS, (pcb) => pcb.pcbOrders)
  @JoinColumn({ name: 'pcbId' })
  pcbs: PCBS;

  @ManyToOne(
    () => Organizations,
    (organization) => organization.pcbManufacturer,
  )
  @JoinColumn({ name: 'pcbManufacturerId' })
  manufacturer: Organizations;

  @ManyToOne(() => Organizations, (organization) => organization.pcbFactory)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @ManyToOne(() => OrderTypes, (orderType) => orderType.pcbOrders)
  @JoinColumn({ name: 'orderTypeId' })
  orderTypes: OrderTypes;

  @ManyToOne(() => Employees, (employee) => employee.pcbOrders)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(() => PcbOrderStates, (state) => state.pcbOrders)
  @JoinColumn({ name: 'pcbOrderStatusId' })
  pcbOrderState: PcbOrderStates;
}
