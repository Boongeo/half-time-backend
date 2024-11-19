import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Provider } from '../enums/provider.enum';
import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity()
export class Account extends BaseEntity {
  @Column()
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;
}
