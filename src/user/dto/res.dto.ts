import { ApiProperty } from '@nestjs/swagger';

export class RegisterResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: true })
  profileImage: string;
}
