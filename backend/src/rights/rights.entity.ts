import { RoleRights } from 'src/role-rights/role-rights.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rights {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => RoleRights, (roleRight) => roleRight.rights)
  roleRights: RoleRights[];
}
