import { CurrentTasks } from 'src/current-tasks/current-tasks.entity';
import { EmployeeDepartments } from 'src/employee-departments/employee-departments.entity';
import { EmployeesProfessions } from 'src/employees-professions/employees-professions.entity';
import { EmployeesVacations } from 'src/employees-vacations/employees-vacations.entity';
import { OrderRequests } from 'src/order-requests/order-requests.entity';
import { PcbOrders } from 'src/pcb-orders/pcb-orders.entity';
import { Peoples } from 'src/peoples/peoples.entity';
import { ShipmentTrips } from 'src/shipment-trips/shipment-trips.entity';
import { Stands } from 'src/stands/stands.entity';
import { User } from 'src/user/user.entity';

import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Employees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  dismissalDate?: Date;

  @ManyToOne(() => Peoples, (people) => people.employees)
  @JoinColumn({ name: 'peopleId' })
  peoples: Peoples;

  @OneToMany(
    () => EmployeeDepartments,
    (employeeDepartment) => employeeDepartment.employees,
  )
  employeeDepartments: EmployeeDepartments[];

  @OneToMany(() => CurrentTasks, (currentTask) => currentTask.employees)
  currentTasks: CurrentTasks[];

  @OneToMany(() => Stands, (stand) => stand.employees)
  stands: Stands[];

  @OneToMany(() => ShipmentTrips, (shipmentTrip) => shipmentTrip.employees)
  shipmentTrips: ShipmentTrips[];

  @OneToMany(() => OrderRequests, (orderReq) => orderReq.employeeCreator)
  creator: OrderRequests[];

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.employees)
  pcbOrders: PcbOrders[];

  @OneToMany(
    () => EmployeesProfessions,
    (employeeProfession) => employeeProfession.employees,
  )
  employeesProfessions: EmployeesProfessions[];

  @OneToMany(
    () => EmployeesVacations,
    (employeeVacation) => employeeVacation.employees,
  )
  employeesVacations: EmployeesVacations[];

  @OneToMany(() => User, (user) => user.employees)
  users: User[];
}
