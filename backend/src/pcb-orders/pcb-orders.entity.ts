import { Employees } from 'src/employees/employees.entity';
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

  @Column({ length: 45 })
  billNumber: string;

  @Column()
  count: number;

  @Column({ type: 'float' })
  width: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  thickness: number;

  @Column({ length: 45 })
  article: string;

  @Column({ type: 'float' })
  price: number;
  
  @ManyToOne(() => PCBS, (pcb) => pcb.pcbOrders)
  @JoinColumn({ name: 'pcbId' })
  pcb: PCBS;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'pcbManufacturerId' })
  pcbManufacturer: Organizations;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @ManyToOne(() => Employees)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(() => PcbOrderStates, (state) => state.pcbOrders)
  @JoinColumn({ name: 'pcbOrderStatusId' })
  pcbOrderState: PcbOrderStates;
}
