import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Interest } from '../../interest/entity/interest.entity';
import { Mentee } from './mentee.entity';

@Entity()
export class MenteeInterest extends BaseEntity {
  @ManyToOne(() => Mentee, (mentor) => mentor.techStacks)
  mentee: Mentee;

  @ManyToOne(() => Interest, (interest) => interest.mentorInterest)
  interest: Interest;
}
