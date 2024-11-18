import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { Repository } from 'typeorm';
import { BoardResDto } from './dto/res.dto';
import { BoardReqDto } from './dto/req.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAll(page: number, size: number) {
    return this.boardRepository
      .find({
        skip: (page - 1) * size,
        take: size,
      })
      .then((boards) => boards.map(BoardResDto.toDto));
  }

  async create({ title, body }: BoardReqDto) {
    await this.boardRepository.save({ title, body });
    return { title, body };
  }

  async findOne(id: string) {
    return this.boardRepository
      .findOneBy({ id })
      .then((board) => BoardResDto.toDto(board));
  }

  async update(id: string, { title, body }: BoardReqDto) {
    await this.boardRepository.update({ id }, { title, body });
    return { title, body };
  }

  async remove(id: string) {
    await this.boardRepository.delete({ id });
    return { id };
  }
}
