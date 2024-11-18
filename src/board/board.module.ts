import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  exports: [],
  controllers: [],
  providers: [],
})
export class BoardModule {}
