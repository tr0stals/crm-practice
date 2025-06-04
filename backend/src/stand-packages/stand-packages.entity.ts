import { Stands } from 'src/stands/stands.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StandPackages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column()
  weight: string;

  @Column()
  comment: string;

  @ManyToOne(() => Stands, (stand) => stand.standPackages)
  @JoinColumn({ name: 'standId' })
  stands: Stands;
}
