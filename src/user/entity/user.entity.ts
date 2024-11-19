import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Account } from '../../auth/entity/account.entity';
import { Role } from '../enums/role.enum';
import { Mentee } from '../../mentee/entity/mentee.entity';
import { Mentor } from '../../mentor/entity/mentor.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true, unique: true })
  nickname: string;

  @Column({ type: 'enum', enum: Role, default: Role.GUEST })
  role: Role;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToOne(() => Mentee, (mentee) => mentee.user)
  mentee: Mentee;

  @OneToOne(() => Mentor, (mentor) => mentor.user)
  mentor: Mentor;
}
