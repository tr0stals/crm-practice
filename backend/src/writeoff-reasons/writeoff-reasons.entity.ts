import { Writeoff } from 'src/writeoff/writeoff.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WriteoffReasons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Writeoff, (writeoff) => writeoff.writeoffReasons)
  writeoffs: Writeoff[];
}
