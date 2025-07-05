import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { EmployeeDepartments } from 'src/employee_departments/employee_departments.entity';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { EmployeesVacations } from 'src/employees_vacations/employees_vacations.entity';
import { OrderRequests } from 'src/order_requests/order_requests.entity';
import { PcbOrders } from 'src/pcb_orders/pcb_orders.entity';
import { Peoples } from 'src/peoples/peoples.entity';
import { ShipmentTrips } from 'src/shipment_trips/shipment_trips.entity';
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
  hiringDate: Date;

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
