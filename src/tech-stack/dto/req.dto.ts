import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TechStackReqDto {
  @ApiProperty({
    required: true,
    example: 'Node.js',
    description: 'Name of the tech stack',
  })
  @IsNotEmpty()
  @IsString()
  techName: string;
}
