import { Groups } from 'src/groups/groups.entity';
import { User } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Students {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.students)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Groups, (group) => group.students)
  @JoinColumn({ name: 'groupId' })
  groups: Groups;
}
