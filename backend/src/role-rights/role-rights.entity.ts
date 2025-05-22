import { Rights } from 'src/rights/rights.entity';
import { Roles } from 'src/roles/roles.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleRights {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Roles, (role) => role.roleRights)
  @JoinColumn({ name: 'roleId' })
  roles: Roles;

  @ManyToOne(() => Rights, (right) => right.roleRights)
  @JoinColumn({ name: 'rightId' })
  rights: Rights;
}
