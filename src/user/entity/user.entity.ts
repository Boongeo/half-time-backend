import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Account } from '../../auth/entity/account.entity';
import { Mentee } from '../../mentee/entity/mentee.entity';
import { Mentor } from '../../mentor/entity/mentor.entity';
import { UserRolesEntity } from './user-roles.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true, unique: true })
  nickname: string;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToOne(() => Mentee, (mentee) => mentee.user)
  mentee: Mentee;

  @OneToOne(() => Mentor, (mentor) => mentor.user)
  mentor: Mentor;

  @OneToMany(() => UserRolesEntity, (userRoles) => userRoles.user)
  userRoles: UserRolesEntity[];
}
