import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from './user.entity';
import { RoleEntity } from './roles.entity';

@Entity()
export class UserRolesEntity extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userRoles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  static createUserRole(user: User, role: RoleEntity) {
    const userRole = new UserRolesEntity();
    userRole.user = user;
    userRole.role = role;
    return userRole;
  }
}
