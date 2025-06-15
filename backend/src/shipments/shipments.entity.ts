import { EmployeeTasks } from 'src/employee-tasks/employee-tasks.entity';
import { License } from 'src/license/license.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { ShipmentPackage } from 'src/shipment-package/shipment-package.entity';
import { ShipmentStates } from 'src/shipment-states/shipment-states.entity';
import { ShipmentTrips } from 'src/shipment-trips/shipment-trips.entity';
import { StandAssemblies } from 'src/stand-assemblies/stand-assemblies.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Shipments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  standNumber: string;

  @Column({ type: 'date' })
  addedDate: Date;

  @Column({ type: 'date' })
  shipmentDate: Date;

  @Column()
  specification: string;

  @Column()
  comment: string;

  @OneToMany(
    () => ShipmentPackage,
    (shipmentPackage) => shipmentPackage.shipments,
  )
  shipmentPackages: ShipmentPackage[];

  @ManyToOne(() => ShipmentStates, (state) => state.shipments)
  @JoinColumn({ name: 'shipmentStateId' })
  shipmentStates: ShipmentStates;

  @OneToOne(() => License, (license) => license.shipment)
  @JoinColumn({ name: 'licenseId' })
  licenses: License;

  @OneToMany(() => ShipmentTrips, (shipmentTrip) => shipmentTrip.shipments)
  shipmentTrips: ShipmentTrips[];

  @OneToMany(() => EmployeeTasks, (employeeTask) => employeeTask.shipments)
  employeeTasks: EmployeeTasks[];

  @ManyToOne(
    () => Organizations,
    (organization) => organization.shipmentFactory,
  )
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;

  @ManyToOne(() => Organizations, (organization) => organization.transporter)
  @JoinColumn({ name: 'transporterId' })
  transporter: Organizations;

  @ManyToOne(() => Organizations, (organization) => organization.client)
  @JoinColumn({ name: 'clientId' })
  client: Organizations;

  @ManyToOne(() => StandAssemblies, (standAssembly) => standAssembly.shipments)
  @JoinColumn({ name: 'standAssemblyId' })
  standAssemblies: StandAssemblies;
}
