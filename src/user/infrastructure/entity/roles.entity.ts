import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Role } from '../../common/enums/role.enum';
import { UserRolesEntity } from './user-roles.entity';

// 우선 매핑 용도로만 사용중이므로 Domain 분리가 불필요하다고 판단
@Entity()
export class RoleEntity extends BaseEntity {
  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToMany(() => UserRolesEntity, (userRolesEntity) => userRolesEntity.role)
  userRoles: UserRolesEntity;
}
