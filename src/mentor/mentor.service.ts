import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../interest/entity/interest.entity';
import { Transactional } from 'typeorm-transactional';
import { User } from '../user/entity/user.entity';
import { Mentor } from './entity/mentor.entity';
import { MentorInterest } from './entity/mentor-interest.entity';
import { MentorTechStack } from './entity/mentor-tech-stack.entity';
import { TechStack } from '../tech-stack/entity/tech-stack.entity';

@Injectable()
export class MentorService {
  constructor(
    @InjectRepository(Mentor)
    private readonly mentorRepository: Repository<Mentor>,
    @InjectRepository(MentorInterest)
    private readonly mentorInterestRepository: Repository<MentorInterest>,
    @InjectRepository(MentorTechStack)
    private readonly mentorTechStackRepository: Repository<MentorTechStack>,
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
    @InjectRepository(TechStack)
    private readonly techStackRepository: Repository<TechStack>,
  ) {}

  @Transactional()
  async createMentorProfile(
    user: User,
    interestNames: string[],
    techStackNames: string[],
    introduction: string,
  ) {
    const interests = await this.interestRepository.find({
      where: interestNames.map((name) => ({ interest: name })),
    });
    if (interests.length !== interestNames.length) {
      throw new Error('일치하지 않는 관심사가 있습니다.');
    }

    const techStacks = await this.techStackRepository.find({
      where: techStackNames.map((name) => ({ tech: name })),
    });
    if (techStacks.length !== techStackNames.length) {
      throw new Error('일치하지 않는 기술스택이 있습니다.');
    }

    const mentor = await this.mentorRepository.save({
      user,
      description: introduction,
    });

    const mentorInterests = interests.map((interest) =>
      this.mentorInterestRepository.create({
        interest,
        mentor: mentor,
      }),
    );

    const mentorTechStacks = techStacks.map((techStack) =>
      this.mentorTechStackRepository.create({
        techStack,
        mentor: mentor,
      }),
    );

    await this.mentorInterestRepository.save(mentorInterests);
    await this.mentorTechStackRepository.save(mentorTechStacks);

    return mentor;
  }
}
