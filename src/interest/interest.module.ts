import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entity/interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  exports: [],
  controllers: [],
  providers: [],
})
export class InterestModule {}
