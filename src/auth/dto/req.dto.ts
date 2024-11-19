import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'verify email', example: 'example@example.com' })
  email: string;
}
