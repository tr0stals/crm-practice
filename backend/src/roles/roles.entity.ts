import { RoleRights } from 'src/role-rights/role-rights.entity';
import { UserRoles } from 'src/user-roles/user-roles.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserRoles, (userRoles) => userRoles.roles)
  userRoles: UserRoles[];

  @OneToMany(() => RoleRights, (roleRight) => roleRight.roles)
  roleRights: RoleRights[];
}
