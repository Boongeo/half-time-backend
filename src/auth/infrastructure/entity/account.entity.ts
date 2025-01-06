import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Provider } from '../../enums/provider.enum';
import { User } from '../../../user/infrastructure/entity/user.entity';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('Account')
export class AccountEntity extends BaseEntity {
  @Column()
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  @Column({ nullable: true })
  socialId?: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;
}
