import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from '../../user/entity/user.entity';
import { MentorTechStack } from '../../mentor-tech-stack/entity/mentor-tech-stack.entity';

@Entity()
export class Mentor extends BaseEntity {
  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.mentor)
  @JoinColumn()
  user: User;

  @OneToMany(() => MentorTechStack, (mentorTechStack) => mentorTechStack.mentor)
  techStacks: MentorTechStack[];
}