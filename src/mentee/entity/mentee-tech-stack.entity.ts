import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { TechStack } from '../../tech-stack/entity/tech-stack.entity';
import { Mentee } from './mentee.entity';

@Entity()
export class MenteeTechStack extends BaseEntity {
  @ManyToOne(() => Mentee, (mentee) => mentee.techStacks)
  mentee: Mentee;

  @ManyToOne(() => TechStack, (techStack) => techStack.mentorTechStacks)
  techStack: TechStack;
}
