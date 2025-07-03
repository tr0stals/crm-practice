import { Components } from 'src/components/components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { WriteoffReasons } from 'src/writeoff_reasons/writeoff_reasons.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Writeoff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateTime: Date;

  @Column()
  count: number;

  @Column()
  comment?: string;

  @ManyToOne(
    () => WriteoffReasons,
    (writeoffReason) => writeoffReason.writeoffs,
  )
  @JoinColumn({ name: 'writeoffReasonId' })
  writeoffReasons: WriteoffReasons;

  @ManyToOne(() => Components, (component) => component.writeoffs)
  @JoinColumn({ name: 'componentId' })
  components: Components;

  @ManyToOne(() => Organizations, (org) => org.writeoffs)
  @JoinColumn({ name: 'factoryId' })
  factory: Organizations;
}
