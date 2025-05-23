import { User } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  phone: string;

  @Column()
  birthDate: Date;

  @ManyToOne(() => User, (user) => user.employees)
  @JoinColumn({ name: 'userId' })
  user: User;
} 