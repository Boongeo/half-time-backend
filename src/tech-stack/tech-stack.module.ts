import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStack } from './entity/tech-stack.entity';
import { TechStackController } from './tech-stack.controller';
import { TechStackService } from './tech-stack.service';

@Module({
  imports: [TypeOrmModule.forFeature([TechStack])],
  exports: [],
  controllers: [TechStackController],
  providers: [TechStackService],
})
export class TechStackModule {}
