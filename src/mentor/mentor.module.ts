import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './infrastructure/entity/mentor.entity';
import { MentorTechStack } from './infrastructure/entity/mentor-tech-stack.entity';
import { MentorInterest } from './infrastructure/entity/mentor-interest.entity';
import { MentorController } from './presentation/mentor.controller';
import { MentorService } from './application/mentor.service';
import { InterestModule } from '../interest/interest.module';
import { TechStackModule } from '../tech-stack/tech-stack.module';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentor, MentorTechStack, MentorInterest]),
    InterestModule,
    TechStackModule,
    UserModule,
    CommonModule,
  ],
  exports: [],
  controllers: [MentorController],
  providers: [MentorService],
})
export class MentorModule {}
