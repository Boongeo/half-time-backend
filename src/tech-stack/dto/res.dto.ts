import { ApiProperty } from '@nestjs/swagger';

export class TechStackResDto {
  @ApiProperty()
  name: string;
}
