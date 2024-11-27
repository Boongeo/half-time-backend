import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entity/mentor.entity';
import { MentorTechStack } from './entity/mentor-tech-stack.entity';
import { MentorInterest } from './entity/mentor-interest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentor, MentorTechStack, MentorInterest]),
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class MentorModule {}
