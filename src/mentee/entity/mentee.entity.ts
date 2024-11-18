import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Mentee extends BaseEntity {
  @OneToOne(() => User, (user) => user.mentee)
  @JoinColumn()
  user: User;
}
