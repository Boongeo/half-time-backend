import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entity/mentor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentor])],
  exports: [],
  controllers: [],
  providers: [],
})
export class MentorModule {}
