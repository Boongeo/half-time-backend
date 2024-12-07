import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../interest/entity/interest.entity';
import { Transactional } from 'typeorm-transactional';
import { Mentor } from './entity/mentor.entity';
import { MentorInterest } from './entity/mentor-interest.entity';
import { MentorTechStack } from './entity/mentor-tech-stack.entity';
import { TechStack } from '../tech-stack/entity/tech-stack.entity';
import { UserAfterAuth } from '../common/decorater/user.decorator';
import { UserService } from '../user/user.service';
import { MentorProfileResDto, MyMentorProfileResDto } from './dto/res.dto';
import { GetMentorProfilesDto, MentorProfileReqDto } from './dto/req.dto';
import { UploadService } from '../common/interfaces/upload.service';

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
    @Inject()
    private readonly userService: UserService,
    @Inject('UploadService')
    private readonly uploadService: UploadService,
  ) {}

  @Transactional()
  async createMentorProfile(
    userAfterAuth: UserAfterAuth,
    {
      interest: interestNames,
      techStack: techStackNames,
      intro: introduction,
      company,
      experience,
      hourlyRate,
      mentoringType,
      preferredRegion,
    }: MentorProfileReqDto,
    careerProof: Express.Multer.File,
  ) {
    const user = await this.userService.findUserById(userAfterAuth.id);

    const existMentor = await this.mentorRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existMentor) {
      throw new Error('이미 등록 요청이 있습니다.');
    }

    const interests = await this.interestRepository.find({
      where: interestNames.map((name) => ({ interest: name })),
    });
    if (interests.length !== interestNames.length) {
      const missingInterests = interestNames.filter(
        (name) => !interests.some((interest) => interest.interest === name),
      );
      console.error('일치하지 않는 관심사가 있습니다.', {
        requested: interestNames,
        found: interests.map((i) => i.interest),
        missing: missingInterests,
      });
      throw new Error(
        '일치하지 않는 관심사가 있습니다: ' + missingInterests.join(', '),
      );
    }

    const techStacks = await this.techStackRepository.find({
      where: techStackNames.map((name) => ({ tech: name })),
    });
    if (techStacks.length !== techStackNames.length) {
      const missingTechStacks = techStackNames.filter(
        (name) => !techStacks.some((techStack) => techStack.tech === name),
      );
      console.error('일치하지 않는 기술스택이 있습니다.', {
        requested: techStackNames,
        found: techStacks.map((t) => t.tech),
        missing: missingTechStacks,
      });
      throw new Error(
        '일치하지 않는 기술스택이 있습니다: ' + missingTechStacks.join(', '),
      );
    }

    const careerProofPath =
      await this.uploadService.uploadSensitiveFile(careerProof);

    const mentor = await this.mentorRepository.save({
      user,
      description: introduction,
      company,
      experience,
      hourlyRate,
      mentoringType,
      preferredRegion,
      careerProofPath,
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

    return MyMentorProfileResDto.toDto(user, mentor);
  }

  async getMentorProfiles(getMentorProfilesDto: GetMentorProfilesDto) {
    const { search, techStack, interest, page, size } = getMentorProfilesDto;

    const queryBuilder = this.mentorRepository
      .createQueryBuilder('mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .leftJoinAndSelect('mentor.mentorInterests', 'mentorInterests')
      .leftJoinAndSelect('mentor.mentorTechStacks', 'mentorTechStacks')
      .leftJoinAndSelect('mentorTechStacks.techStack', 'techStack')
      .leftJoinAndSelect('mentorInterests.interest', 'interest');

    if (search) {
      queryBuilder.andWhere('user.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (techStack) {
      queryBuilder.andWhere('techStack.tech IN (:...techStack)', { techStack });
    }

    if (interest) {
      queryBuilder.andWhere('interest.interest IN (:...interest)', {
        interest,
      });
    }

    const skip = (page - 1) * size; // 몇 개를 건너뛸지 계산
    queryBuilder.skip(skip).take(size);

    const [mentors, total] = await queryBuilder.getManyAndCount();

    const mentorDtos = mentors.map((mentor) => {
      const user = mentor.user; // 연결된 User 정보
      return MentorProfileResDto.toDto(user, mentor);
    });

    return {
      mentors: mentorDtos,
      total,
    };
  }

  async getMentorProfile(mentorId: number) {
    const queryBuilder = this.mentorRepository
      .createQueryBuilder('mentor')
      .leftJoinAndSelect('mentor.user', 'user')
      .leftJoinAndSelect('mentor.mentorInterests', 'mentorInterests')
      .leftJoinAndSelect('mentor.mentorTechStacks', 'mentorTechStacks')
      .leftJoinAndSelect('mentorTechStacks.techStack', 'techStack')
      .leftJoinAndSelect('mentorInterests.interest', 'interest')
      .where('mentor.id = :mentorId', { mentorId });

    const mentor = await queryBuilder.getOne();
    return MentorProfileResDto.toDto(mentor.user, mentor);
  }

  async getMyMentorStatus(userAfterAuth: UserAfterAuth) {
    const mentor = await this.mentorRepository.findOne({
      where: { user: { id: userAfterAuth.id } },
    });
    if (!mentor) throw new Error('멘토로 등록되지 않은 사용자입니다.');

    return {
      status: mentor.accept,
      rejectReason: mentor.rejectReason,
      updatedAt: mentor.updatedAt,
    };
  }
}
