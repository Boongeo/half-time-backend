import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from '../../user/entity/user.entity';
import { MentorTechStack } from './mentor-tech-stack.entity';
import { MentorInterest } from './mentor-interest.entity';
import { MentorAccept } from '../enum/mentor.enum';

@Entity()
export class Mentor extends BaseEntity {
  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: MentorAccept,
    default: MentorAccept.PENDING,
  })
  accept: MentorAccept;

  @Column({ nullable: true })
  rejectReason: string;

  @OneToOne(() => User, (user) => user.mentor)
  @JoinColumn()
  user: User;

  @OneToMany(() => MentorTechStack, (mentorTechStack) => mentorTechStack.mentor)
  techStacks: MentorTechStack[];

  @OneToMany(() => MentorInterest, (mentorInterest) => mentorInterest.mentor)
  interests: MentorInterest[];
}
