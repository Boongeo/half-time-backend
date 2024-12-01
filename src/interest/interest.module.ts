import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entity/interest.entity';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  exports: [TypeOrmModule],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}
