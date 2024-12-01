import { ApiProperty } from '@nestjs/swagger';
import { Interest } from '../entity/interest.entity';

export class InterestResDto {
  @ApiProperty({
    example: 'BackEnd',
    description: 'Name of the interest',
  })
  name: string;
}

export class AllInterestResDto {
  @ApiProperty()
  interestNames: string[];

  static toDto(interests: Interest[]): AllInterestResDto {
    const dto = new AllInterestResDto();
    dto.interestNames = interests.map((interest) => interest.interest);
    return dto;
  }
}
