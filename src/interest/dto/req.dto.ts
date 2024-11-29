import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InterestReqDto {
  @ApiProperty({
    required: true,
    example: 'BackEnd',
    description: 'Name of the Interest',
  })
  @IsNotEmpty()
  @IsString()
  interestName: string;
}
