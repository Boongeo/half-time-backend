import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from '../../user/entity/user.entity';
import { MenteeTechStack } from './mentee-tech-stack.entity';
import { MenteeInterest } from './mentee-interest.entity';

@Entity()
export class Mentee extends BaseEntity {
  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.mentee)
  @JoinColumn()
  user: User;

  @OneToMany(() => MenteeTechStack, (menteeTechStack) => menteeTechStack.mentee)
  techStacks: MenteeTechStack[];

  @OneToMany(() => MenteeInterest, (mentorInterest) => mentorInterest.mentee)
  interests: MenteeInterest[];
}
