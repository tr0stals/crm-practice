import { Roles } from 'src/roles/roles.entity';
import { User } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  users: User;

  @ManyToOne(() => Roles, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  roles: Roles;
}
