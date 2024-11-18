import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentoringSession } from './entity/mentoring-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringSession])],
  exports: [],
  controllers: [],
  providers: [],
})
export class MentoringSessionModule {}
