import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Mentor } from '../entity/mentor.entity';
import { User } from '../../user/entity/user.entity';
import { MentorProfileReqDto } from './req.dto';
import { MentorAccept, MentoringType } from '../enum/mentor.enum';

export class MyMentorProfileResDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty({
    required: true,
    example: ['BackEnd', 'FrontEnd', 'DevOps'],
    type: [String],
  })
  @IsArray()
  interestNames: string[];

  @ApiProperty({
    required: true,
    example: ['Spring', 'React', 'Next'],
    type: [String],
  })
  @IsArray()
  techStackNames: string[];

  @ApiProperty({
    required: true,
    example: 'Mentor introduction.',
  })
  @IsString()
  @IsOptional()
  introduction: string;

  static toDto(user: User, mentorProfile: Mentor) {
    return {
      id: mentorProfile.id,
      nickname: user.nickname,
      profileImage: user.profileImage,
      introduction: mentorProfile.description,
    };
  }
}

export class MentorProfileResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty({
    required: true,
    example: ['BackEnd', 'FrontEnd', 'DevOps'],
    type: [String],
  })
  @IsArray()
  interestNames: string[];

  @ApiProperty({
    required: true,
    example: ['Spring', 'React', 'Next'],
    type: [String],
  })
  @IsArray()
  techStackNames: string[];

  @ApiProperty({
    required: true,
    example: 'Mentor introduction.',
  })
  @IsString()
  @IsOptional()
  introduction: string;

  static toDto(
    user: User,
    mentorProfile: Mentor,
    mentorTechStacks: string[],
    mentorInterests: string[],
  ) {
    return {
      id: mentorProfile.id,
      nickname: user.nickname,
      profileImage: user.profileImage,
      introduction: mentorProfile.description,
      interestNames: mentorInterests,
      techStackName: mentorTechStacks,
    };
  }
}

export class MentorProfilesResDto {
  @ApiProperty({ type: [MentorProfileResDto] })
  mentors: MentorProfileReqDto[];

  @IsNumber()
  total: number;
}

export class MentorStatusResDto {
  @ApiProperty({
    enum: MentorAccept,
    description: 'Status of mentor acceptance (pending, approved, rejected)',
  })
  status: MentorAccept;

  @ApiProperty({
    description: 'Reason for rejection, if the mentor status is not approved.',
  })
  rejectReason: string;

  @ApiProperty({
    description: 'Date when the mentor status was last updated.',
  })
  updateAt: string;
}

export class MentorAcceptReqDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  status: MentorAccept;
}

export class AdminMentorRegistrationResDto {
  @ApiProperty({ required: true })
  mentorId: number;

  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({ required: true })
  status: string;

  @ApiProperty({ required: true })
  company: string;

  @ApiProperty({ required: true })
  experience: number;

  @ApiProperty({ required: true })
  createdAt: string;

  static toDto(user: User, mentor: Mentor) {
    return {
      mentorId: mentor.id,
      userId: user.id,
      status: mentor.accept,
      company: mentor.company,
      experience: mentor.experience,
      createdAt: mentor.createdAt.toISOString,
    };
  }
}

export class AdminMentorResDto {
  @ApiProperty({ required: true })
  memberId: string;

  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({
    enum: ['pending', 'approved', 'rejected'],
    description: 'Status of the mentor',
  })
  @IsEnum(MentorAccept)
  status: MentorAccept;

  @ApiProperty({ required: true })
  company: string;

  @ApiProperty({ required: true })
  experience: number;

  @ApiProperty({
    type: [String],
    description: 'Tech stacks the mentor is proficient with',
  })
  techStack: string[];

  @ApiProperty({ required: true })
  interest: string[];

  @ApiProperty({ required: true })
  intro: string;

  @ApiProperty({ required: true })
  hourlyRate: number;

  @ApiProperty({
    enum: ['online', 'offline', 'both'],
    description: 'Type of mentoring offered by the mentor',
  })
  @IsEnum(MentoringType)
  mentoringType: MentoringType;

  @ApiProperty({ required: true })
  preferredRegion: string;

  @ApiProperty({ required: true })
  careerProofUrl: string;

  // @ApiProperty({ required: true })
  // portfolioUrl: string;
  //
  // @ApiProperty({ required: true })
  // githubUrl: string;

  @ApiProperty({
    required: false,
    description: 'Reason for rejection if applicable',
  })
  rejectReason: string | null;

  @ApiProperty({ required: true })
  createdAt: string;

  @ApiProperty({ required: true })
  updatedAt: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: true })
  email: string;

  static toDto(
    user: User,
    mentor: Mentor,
    interest: string[],
    techStack: string[],
  ) {
    return {
      memberId: mentor.id,
      userId: user.id,
      status: mentor.accept,
      company: mentor.company,
      experience: mentor.experience,
      techStack,
      interest,
      intro: mentor.description,
      hourlyRate: mentor.hourlyRate,
      mentoringType: mentor.mentoringType,
      preferredRegion: mentor.preferredRegion,
      careerProofUrl: mentor.careerProofPath,
      // portfolioUrl: '',
      // githubUrl: '',
      rejectReason: mentor.rejectReason,
      createdAt: mentor.createdAt.toISOString(),
      updatedAt: mentor.updatedAt.toISOString(),
      nickname: user.nickname,
      email: user.account.email,
    };
  }
}
