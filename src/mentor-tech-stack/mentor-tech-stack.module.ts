import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorTechStack } from './entity/mentor-tech-stack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorTechStack])],
  exports: [],
  controllers: [],
  providers: [],
})
export class MentorTechStackModule {}
