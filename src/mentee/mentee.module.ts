import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentee } from './entity/mentee.entity';
import { MenteeInterest } from './entity/mentee-interest.entity';
import { MenteeTechStack } from './entity/mentee-tech-stack.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentee, MenteeInterest, MenteeTechStack]),
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class MenteeModule {}
