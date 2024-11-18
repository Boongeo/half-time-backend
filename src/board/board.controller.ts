import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PageReqDto } from '../common/dto/req.dto';
import { BoardService } from './board.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { BoardResDto } from './dto/res.dto';
import {
  ApiDeleteResponse,
  ApiGetItemsResponse,
  ApiGetResponse,
  ApiPostResponse,
  ApiUpdateResponse,
} from '../common/decorater/swagger.decorator';
import { PageResDto } from '../common/dto/res.dto';
import { BoardReqDto, FindBoardReqDto } from './dto/req.dto';

@ApiTags('Board')
@ApiExtraModels(PageResDto, BoardResDto)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiGetItemsResponse(BoardResDto)
  @Get()
  async findAll(@Query() { page, size }: PageReqDto) {
    return this.boardService.findAll(page, size);
  }

  @ApiPostResponse(BoardResDto)
  @Post()
  async create(@Body() boardReqDto: BoardReqDto) {
    return this.boardService.create(boardReqDto);
  }

  @ApiGetResponse(BoardResDto)
  @Get(':id')
  async findOne(@Param() { id }: FindBoardReqDto) {
    return this.boardService.findOne(id);
  }

  @ApiUpdateResponse(BoardResDto)
  @Put(':id')
  async update(
    @Param() { id }: FindBoardReqDto,
    @Body() boardReqDto: BoardReqDto,
  ) {
    return this.boardService.update(id, boardReqDto);
  }

  @ApiDeleteResponse()
  @Delete(':id')
  async remove(@Param() { id }: FindBoardReqDto) {
    return this.boardService.remove(id);
  }
}
