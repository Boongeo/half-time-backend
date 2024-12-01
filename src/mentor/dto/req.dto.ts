import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class MentorProfileReqDto {
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
}
