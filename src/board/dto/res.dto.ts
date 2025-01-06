import { ApiProperty } from '@nestjs/swagger';
import { BoardEntity } from '../entity/board.entity';

export class BoardResDto {
  constructor(partial: Partial<BoardResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  body: string;

  static toDto(board: BoardEntity) {
    return new BoardResDto({
      id: board.id,
      title: board.title,
      body: board.body,
    });
  }
}
