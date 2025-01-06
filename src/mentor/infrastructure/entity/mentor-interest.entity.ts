import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Mentor } from './mentor.entity';
import { Interest } from '../../../interest/infrastructure/entity/interest.entity';

@Entity()
export class MentorInterest extends BaseEntity {
  @ManyToOne(() => Mentor, (mentor) => mentor.interests)
  mentor: Mentor;

  @ManyToOne(() => Interest, (interest) => interest.mentorInterest)
  interest: Interest;
}
