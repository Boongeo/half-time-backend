import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Mentor } from './mentor.entity';
import { TechStack } from '../../tech-stack/entity/tech-stack.entity';

@Entity()
export class MentorTechStack extends BaseEntity {
  @ManyToOne(() => Mentor, (mentor) => mentor.techStacks)
  mentor: Mentor;

  @ManyToOne(() => TechStack, (techStack) => techStack.mentorTechStacks)
  techStack: TechStack;
}
