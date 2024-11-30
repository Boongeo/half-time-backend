import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Mentor } from '../entity/mentor.entity';
import { UserAfterAuth } from '../../common/decorater/user.decorator';
import { User } from '../../user/entity/user.entity';

export class MyMentorProfileResDto {
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
      nickname: user.nickname,
      profileImage: user.profileImage,
      introduction: mentorProfile.description,
    };
  }
}
