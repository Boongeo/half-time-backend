import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentee } from './infrastructure/entity/mentee.entity';
import { MenteeInterest } from './infrastructure/entity/mentee-interest.entity';
import { MenteeTechStack } from './infrastructure/entity/mentee-tech-stack.entity';
import { MenteeService } from './application/mentee.service';
import { InterestModule } from '../interest/interest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentee, MenteeInterest, MenteeTechStack]),
    InterestModule,
  ],
  exports: [MenteeService],
  controllers: [],
  providers: [MenteeService],
})
export class MenteeModule {}
