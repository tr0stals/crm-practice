import { License } from 'src/license/license.entity';
import { Stands } from 'src/stands/stands.entity';
import { Tutors } from 'src/tutors/tutors.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Shipments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inventoryNumber: string;

  @Column()
  sendingDate: Date;

  @Column()
  comment?: string;

  @OneToMany(() => License, (license) => license.shipments)
  licenses: License[];

  @ManyToOne(() => Tutors, (tutor) => tutor.shipments)
  @JoinColumn({ name: 'tutorId' })
  tutors: Tutors;

  @ManyToOne(() => Stands, (stand) => stand.shipments)
  @JoinColumn({ name: 'standId' })
  stands: Stands;
}
