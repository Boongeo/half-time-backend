import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './infrastructure/entity/interest.entity';
import { InterestService } from './application/interest.service';
import { InterestController } from './presentation/interest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  exports: [TypeOrmModule],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}
