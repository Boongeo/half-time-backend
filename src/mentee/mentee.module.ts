import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentee } from './entity/mentee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentee])],
  exports: [],
  controllers: [],
  providers: [],
})
export class MenteeModule {}
