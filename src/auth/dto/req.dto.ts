import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VerifyEmailReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'verify email', example: 'example@example.com' })
  email: string;
}

export class VerifyTokenReqDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'verify token', example: '123456' })
  verifyToken: number;
}
