import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BoardReqDto {
  @ApiProperty({ description: 'board title', example: 'test' })
  title: string;

  @ApiProperty({ description: 'board body', example: 'test body' })
  body: string;
}

export class FindBoardReqDto {
  @ApiProperty({ description: 'board id', example: '123e4567-e89' })
  @IsUUID()
  id: string;
}
