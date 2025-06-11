import { Stands } from 'src/stands/stands.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StandsTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToOne(() => Stands, (stand) => stand.standTypes)
  stands: Stands[];
}
