import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';
import { ServerArrivals } from 'src/server_arrivals/server_arrivals.entity';
import { Stands } from 'src/stands/stands.entity';
import { CurrentTaskStatesLog } from 'src/current_task_states_log/current_task_states_log.entity';

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

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ length: 45 })
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

  @ManyToOne(() => Stands, (stand) => stand.currentTasks)
  @JoinColumn({ name: 'standId' })
  stands: Stands;

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

  @OneToMany(() => CurrentTaskStatesLog, (log) => log.currentTask)
  currentTaskStatesLogs: CurrentTaskStatesLog[];
}
