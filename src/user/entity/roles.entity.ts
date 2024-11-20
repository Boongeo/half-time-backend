import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Role } from '../enums/role.enum';
import { UserRolesEntity } from './user-roles.entity';

@Entity()
export class RoleEntity extends BaseEntity {
  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToMany(() => UserRolesEntity, (userRolesEntity) => userRolesEntity.role)
  userRoles: UserRolesEntity;
}
