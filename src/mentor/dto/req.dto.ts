import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PageReqDto } from '../../common/dto/req.dto';

export class MentorProfileReqDto {
  @ApiProperty({
    required: true,
    example: ['BackEnd', 'FrontEnd', 'DevOps'],
    type: [String],
  })
  @IsArray()
  interest: string[];

  @ApiProperty({
    required: true,
    example: ['Spring', 'React', 'Next'],
    type: [String],
  })
  @IsArray()
  techStack: string[];

  @ApiProperty({
    required: true,
    example: 'Mentor introduction.',
  })
  @IsString()
  @IsOptional()
  introduction: string;
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

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // experience?: string[];
  //
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // rating?: string[];
  //
  // @IsOptional()
  // @IsNumber()
  // priceMin?: number;
  //
  // @IsOptional()
  // @IsNumber()
  // priceMax?: number;
}
