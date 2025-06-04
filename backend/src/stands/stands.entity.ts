import { Employees } from 'src/employees/employees.entity';
import { OrderRequests } from 'src/order-requests/order-requests.entity';
import { PCBS } from 'src/pcbs/pcbs.entity';
import { StandAssemblies } from 'src/stand-assemblies/stand-assemblies.entity';
import { StandPackages } from 'src/stand-packages/stand-packages.entity';
import { StandsTypes } from 'src/stand-types/stand-types.entity';
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
export class Stands {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  size: string;

  @Column()
  weight: number;

  @Column()
  link: string;

  @Column()
  vendorCode: string;

  @Column()
  comment: string;

  @OneToOne(() => StandsTypes, (type) => type.stands)
  @JoinColumn({ name: 'standTypeId' })
  standTypes: StandsTypes;

  @ManyToOne(() => Employees, (employee) => employee.stands)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @OneToMany(() => StandAssemblies, (standAssembly) => standAssembly.stands)
  standAssemblies: StandAssemblies[];

  @OneToMany(() => StandPackages, (standPackages) => standPackages.stands)
  standPackages: StandPackages[];

  @OneToMany(() => OrderRequests, (orderReq) => orderReq.stands)
  orderRequests: OrderRequests[];

  @OneToMany(() => PCBS, (pcbs) => pcbs.stands)
  pcbs: PCBS[];
}
