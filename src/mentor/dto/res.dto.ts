import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Mentor } from '../entity/mentor.entity';
import { User } from '../../user/entity/user.entity';
import { MentorProfileReqDto } from './req.dto';
import { MentorAccept } from '../enum/mentor.enum';

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

  static toDto(user: User, mentorProfile: Mentor) {
    return {
      id: mentorProfile.id,
      nickname: user.nickname,
      profileImage: user.profileImage,
      introduction: mentorProfile.description,
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
  @ApiProperty({ type: MentorProfileResDto })
  mentor: MentorProfileResDto;
}

export class MentorAcceptReqDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  status: MentorAccept;


}
