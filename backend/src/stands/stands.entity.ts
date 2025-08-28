import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { Employees } from 'src/employees/employees.entity';
import { OrderRequests } from 'src/order_requests/order_requests.entity';
import { PCBS } from 'src/pcbs/pcbs.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { StandPackages } from 'src/stand_packages/stand_packages.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { StandsTypes } from 'src/stand_types/stand_types.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stands {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column({ length: 100 })
  width: string;

  @Column({ length: 100 })
  height: string;

  @Column({ length: 100 })
  thickness: string;

  @Column({ type: 'float' })
  weightNetto: number;

  @Column({ type: 'float' })
  weightBrutto: number;

  @Column({ length: 100 })
  link: string;

  @Column()
  vendorCode: string;

  @Column({ type: 'date' })
  manufactureTime: Date;

  @Column({ length: 45, nullable: true })
  comment: string;

  @ManyToOne(() => StandsTypes, (type) => type.stands)
  @JoinColumn({ name: 'standTypeId' })
  standType: StandsTypes;

  @ManyToOne(() => Employees, (employee) => employee.stands)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @OneToMany(() => StandPackages, (standPackages) => standPackages.stands)
  standPackages: StandPackages[];

  @OneToMany(() => OrderRequests, (orderReq) => orderReq.stands)
  orderRequests: OrderRequests[];

  @OneToMany(() => PCBS, (pcbs) => pcbs.stands)
  pcbs: PCBS[];

  @OneToMany(() => ShipmentsStands, (shipmentStand) => shipmentStand.stands)
  shipmentsStands: ShipmentsStands[];

  @OneToMany(() => StandTasks, (standTask) => standTask.stands)
  standTasks: StandTasks[];

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.stands)
  currentTasks: CurrentTasks[];
}
