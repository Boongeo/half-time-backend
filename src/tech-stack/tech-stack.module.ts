import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStack } from './infrastructure/entity/tech-stack.entity';
import { TechStackController } from './presentation/tech-stack.controller';
import { TechStackService } from './application/tech-stack.service';

@Module({
  imports: [TypeOrmModule.forFeature([TechStack])],
  exports: [TypeOrmModule],
  controllers: [TechStackController],
  providers: [TechStackService],
})
export class TechStackModule {}
