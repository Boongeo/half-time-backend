import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStack } from './entity/tech-stack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechStack])],
  exports: [],
  controllers: [],
  providers: [],
})
export class TechStackModule {}
