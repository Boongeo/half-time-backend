import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PageReqDto } from '../../common/dto/req.dto';
import { MentorAccept, MentoringType } from '../enum/mentor.enum';
import { Transform } from 'class-transformer';

export class MentorProfileReqDto {
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @ApiProperty({
    required: true,
    example: ['BackEnd', 'FrontEnd', 'DevOps'],
    type: [String],
  })
  interest: string[];

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @ApiProperty({
    required: true,
    example: ['Spring', 'React', 'Next'],
    type: [String],
  })
  techStack: string[];

  @ApiProperty({
    required: true,
    example: 'Mentor introduction.',
  })
  @IsString()
  intro: string;

  @ApiProperty({
    required: true,
    example: 'Mentor company.',
  })
  @IsString()
  company: string;

  @ApiProperty({
    required: true,
    example: 'Mentor experience.',
  })
  @IsNumber()
  experience: number;

  @ApiProperty({
    required: true,
    example: 'Mentor hourlyRate.',
  })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({
    required: true,
    example: 'Mentoring Type.',
  })
  @IsEnum(MentoringType)
  mentoringType: MentoringType;

  @ApiProperty({
    required: false,
    example: 'preferred region',
  })
  @IsString()
  preferredRegion: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  careerProof: any;
}

export class GetMentorProfilesDto extends PageReqDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interest?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  experience?: string[];
}

export class GetMentorAcceptReqDto extends PageReqDto {
  @IsEnum(['ACCEPT', 'REJECT', 'PENDING'])
  status: MentorAccept;
}
