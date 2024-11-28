import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileReqDto {
  @ApiProperty({ required: true, example: 'nickname' })
  @MinLength(2)
  @MaxLength(30)
  @IsString()
  nickname: string;

  @ApiProperty({
    required: false,
    example: ['BackEnd', 'FrontEnd', 'DevOps'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  interestNames: string[];

  @ApiProperty({
    required: false,
    example: 'Mentee introduction.',
  })
  @IsString()
  @IsOptional()
  introduction: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  profileImage?: any;
}
