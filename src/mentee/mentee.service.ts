import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentee } from './entity/mentee.entity';
import { Repository } from 'typeorm';
import { MenteeInterest } from './entity/mentee-interest.entity';
import { Interest } from '../interest/entity/interest.entity';
import { Transactional } from 'typeorm-transactional';
import { User } from '../user/entity/user.entity';

@Injectable()
export class MenteeService {
  constructor(
    @InjectRepository(Mentee)
    private readonly menteeRepository: Repository<Mentee>,
    @InjectRepository(MenteeInterest)
    private readonly menteeInterestRepository: Repository<MenteeInterest>,
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
  ) {}

  @Transactional()
  async createMenteeProfile(
    user: User,
    interestNames: string[],
    introduction: string,
  ) {
    const interests = await this.interestRepository.find({
      where: interestNames.map((name) => ({ interest: name })),
    });
    if (interests.length !== interestNames.length) {
      throw new Error('일치하지 않는 관심사가 있습니다.');
    }

    const mentee = this.menteeRepository.create({
      user,
      description: introduction,
    });

    const savedMentee = await this.menteeRepository.save(mentee);

    const menteeInterests = interests.map((interest) =>
      this.menteeInterestRepository.create({
        interest,
        mentee: savedMentee
      }),
    );

    await this.menteeInterestRepository.save(menteeInterests);

    return savedMentee;
  }
}
