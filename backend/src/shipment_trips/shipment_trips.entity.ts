import { Employees } from 'src/employees/employees.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ShipmentTrips {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  tripStartDate: Date;

  @Column({ type: 'date' })
  tripEndDate: Date;

  @ManyToOne(() => Shipments, (shipment) => shipment.shipmentTrips)
  @JoinColumn({ name: 'shipmentId' })
  shipments: Shipments;

  @ManyToOne(() => Employees, (employee) => employee.shipmentTrips)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;
}
