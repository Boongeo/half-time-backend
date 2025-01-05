import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from './entity/board.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity])],
  exports: [],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
