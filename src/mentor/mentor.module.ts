import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entity/mentor.entity';
import { MentorTechStack } from './entity/mentor-tech-stack.entity';
import { MentorInterest } from './entity/mentor-interest.entity';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentor, MentorTechStack, MentorInterest]),
  ],
  exports: [],
  controllers: [MentorController],
  providers: [MentorService],
})
export class MentorModule {}
