import { ApiProperty } from '@nestjs/swagger';

export class InterestResDto {
  @ApiProperty({
    example: 'BackEnd',
    description: 'Name of the interest',
  })
  name: string;
}
