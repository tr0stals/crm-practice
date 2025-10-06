import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { Employees } from 'src/employees/employees.entity';
import { License } from 'src/license/license.entity';
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

  @Column({ nullable: true })
  parentId: number | null;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ length: 100, nullable: true })
  width: string;

  @Column({ length: 100, nullable: true })
  height: string;

  @Column({ length: 100, nullable: true })
  thickness: string;

  @Column({ type: 'float', nullable: true })
  weightNetto: number;

  @Column({ type: 'float', nullable: true })
  weightBrutto: number;

  @Column({ length: 100, nullable: true })
  link: string;

  @Column({ nullable: true })
  vendorCode: string;

  @Column({ type: 'int', nullable: true })
  manufactureTime: number;

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

  @OneToMany(() => License, (license) => license.stands)
  licenses: License[];

  @OneToMany(() => ShipmentsStands, (shipmentStand) => shipmentStand.stands)
  shipmentsStands: ShipmentsStands[];

  @OneToMany(() => StandTasks, (standTask) => standTask.stands)
  standTasks: StandTasks[];

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.stands)
  currentTasks: CurrentTasks[];

  // Self-referencing для категорий/подкатегорий
  @ManyToOne(() => Stands, (stand) => stand.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Stands;

  @OneToMany(() => Stands, (stand) => stand.parent)
  children: Stands[];

  // Метод для определения типа записи
  isCategory(): boolean {
    // Если заполнены только parentId и title, то это категория
    return (
      !this.image &&
      !this.width &&
      !this.height &&
      !this.thickness &&
      !this.weightNetto &&
      !this.weightBrutto &&
      !this.link &&
      !this.vendorCode &&
      !this.manufactureTime &&
      !this.comment &&
      !this.standType &&
      !this.employees
    );
  }

  isStand(): boolean {
    return !this.isCategory();
  }
}
