import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResDto {
  @ApiProperty({ required: true })
  email: string;
}

export class AfterVerifyResDto {
  @ApiProperty({ required: true })
  message: string;
}
