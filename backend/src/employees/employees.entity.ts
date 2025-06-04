import { EmployeeDepartments } from 'src/employee-departments/employee-departments.entity';
import { EmployeeStates } from 'src/employee-states/employee-states.entity';
import { EmployeeTasks } from 'src/employee-tasks/employee-tasks.entity';
import { OrderRequests } from 'src/order-requests/order-requests.entity';
import { PcbOrders } from 'src/pcb-orders/pcb-orders.entity';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';
import { ShipmentTrips } from 'src/shipment-trips/shipment-trips.entity';
import { Stands } from 'src/stands/stands.entity';

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

  @Column()
  birthDate: Date;

  @ManyToOne(() => Peoples, (people) => people.employees)
  @JoinColumn({ name: 'peopleId' })
  peoples: Peoples;

  @ManyToOne(() => EmployeeStates, (state) => state.employees)
  @JoinColumn({ name: 'employeeStateId' })
  employeeStates: EmployeeStates;

  @OneToMany(
    () => EmployeeDepartments,
    (employeeDepartment) => employeeDepartment.employees,
  )
  employeeDepartments: EmployeeDepartments[];

  @OneToMany(() => Professions, (profession) => profession.employees)
  professions: Professions[];

  @OneToMany(() => EmployeeTasks, (employeeTask) => employeeTask.employees)
  employeeTasks: EmployeeTasks[];

  @OneToMany(() => Stands, (stand) => stand.employees)
  stands: Stands[];

  @OneToMany(() => ShipmentTrips, (shipmentTrip) => shipmentTrip.employees)
  shipmentTrips: ShipmentTrips[];

  @OneToMany(() => OrderRequests, (orderReq) => orderReq.employeeCreator)
  creator: OrderRequests[];

  @OneToMany(() => OrderRequests, (orderReq) => orderReq.employeeExecutor)
  executor: OrderRequests[];

  @OneToMany(() => PcbOrders, (pcbOrder) => pcbOrder.employees)
  pcbOrders: PcbOrders[];
}
