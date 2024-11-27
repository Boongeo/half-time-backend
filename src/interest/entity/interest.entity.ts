import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { MentorInterest } from '../../mentor/entity/mentor-interest.entity';
import { MenteeInterest } from '../../mentee/entity/mentee-interest.entity';

@Entity()
export class Interest extends BaseEntity {
  @OneToMany(() => MentorInterest, (mentorInterest) => mentorInterest.interest)
  mentorInterest: MentorInterest[];

  @OneToMany(() => MenteeInterest, (menteeInterest) => menteeInterest.interest)
  menteeInterest: MenteeInterest[];

  // 추후 ADMIN 이 관심사를 추가할 수 있도록 하기 위해 추가한 컬럼입니다.
  @Column()
  interest: string;
}
