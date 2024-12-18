import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { MentorTechStack } from '../../mentor/entity/mentor-tech-stack.entity';
import { MenteeTechStack } from '../../mentee/entity/mentee-tech-stack.entity';

@Entity()
export class TechStack extends BaseEntity {
  @OneToMany(
    () => MentorTechStack,
    (mentorTechStack) => mentorTechStack.techStack,
  )
  mentorTechStacks: MentorTechStack[];

  @OneToMany(
    () => MenteeTechStack,
    (menteeTechStack) => menteeTechStack.techStack,
  )
  menteeTechStacks: MentorTechStack[];

  // 추후 ADMIN 이 기술 스택을 추가할 수 있도록 하기 위해 추가한 컬럼입니다.
  @Column()
  tech: string;
}
