import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorAvailability } from './entity/mentor-acailability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorAvailability])],
  exports: [],
  controllers: [],
  providers: [],
})
export class MentorAvailabilityModule {}
