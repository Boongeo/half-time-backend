import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Mentor } from './mentor.entity';
import { Interest } from '../../interest/entity/interest.entity';

@Entity()
export class MentorInterest extends BaseEntity {
  @ManyToOne(() => Mentor, (mentor) => mentor.techStacks)
  mentor: Mentor;

  @ManyToOne(() => Interest, (interest) => interest.mentorInterest)
  interest: Interest;
}
