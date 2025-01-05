import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString, Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class EmailReqDto {
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

export class SignupReqDto {
  @ApiProperty({ required: true, example: 'example@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @ApiProperty({ required: true, example: 'Password1!' })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,30}$/)
  password: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'verify token', example: '123456' })
  verifyToken: number;
}

export class SigninReqDto {
  @ApiProperty({ required: true, example: 'nest@nest.com' })
  @IsEmail()
  @MaxLength(30)
  email: string;

  @ApiProperty({ required: true, example: 'Password1!' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,30}$/)
  password: string;
}
