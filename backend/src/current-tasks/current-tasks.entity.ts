import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTaskStates } from 'src/current-task-states/current-task-states.entity';
import { ShipmentsStands } from 'src/shipments-stands/shipments-stands.entity';
import { StandTasks } from 'src/stand-tasks/stand-tasks.entity';
import { ServerWriteoff } from 'src/server-writeoff/server-writeoff.entity';
import { ServerArrivals } from 'src/server-arrivals/server-arrivals.entity';

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  WAITING_COMPONENTS = 'WAITING_COMPONENTS',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class CurrentTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deadline: Date;

  @Column()
  title: string;

  @ManyToOne(() => Employees, (employee) => employee.currentTasks)
  @JoinColumn({ name: 'employeeId' })
  employees: Employees;

  @ManyToOne(
    () => CurrentTaskStates,
    (currentTaskState) => currentTaskState.currentTasks,
  )
  @JoinColumn({ name: 'currentTaskStateId' })
  currentTaskStates: CurrentTaskStates;

  @ManyToOne(
    () => ShipmentsStands,
    (shipmentStand) => shipmentStand.currentTasks,
  )
  @JoinColumn({ name: 'shipmentStandId' })
  shipmentsStands: ShipmentsStands;

  @ManyToOne(() => StandTasks, (standTask) => standTask.currentTasks)
  @JoinColumn({ name: 'standTaskId' })
  standTasks: StandTasks;

  @OneToMany(
    () => ServerWriteoff,
    (serverWriteoff) => serverWriteoff.currentTasks,
  )
  serverWriteoffs: ServerWriteoff[];

  @OneToMany(
    () => ServerArrivals,
    (serverArrival) => serverArrival.currentTasks,
  )
  serverArrivals: ServerArrivals[];
}
