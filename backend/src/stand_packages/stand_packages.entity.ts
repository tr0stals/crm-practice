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

  @Column({ type: 'float'})
  width: number;

  @Column({ type: 'float'})
  height: number;

  @Column({ type: 'float'})
  thickness: number;

  @Column({ type: 'float'})
  weight: number;

  @Column({ length: 100 })
  image: string;

  @Column({ length: 45, nullable: true })
  comment: string;

  @ManyToOne(() => Stands, (stand) => stand.standPackages)
  @JoinColumn({ name: 'standId' })
  stands: Stands;
}
