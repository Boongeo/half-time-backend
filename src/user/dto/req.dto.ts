import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileReqDto {
  @ApiProperty({ required: true, example: 'nickname' })
  @MinLength(2)
  @MaxLength(30)
  @IsString()
  nickname: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  profileImage?: any;
}
