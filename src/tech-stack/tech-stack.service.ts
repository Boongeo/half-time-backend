import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechStack } from './entity/tech-stack.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechStackService {
  constructor(
    @InjectRepository(TechStack)
    private readonly techStackRepository: Repository<TechStack>,
  ) {}

  async appendTechStack(techName: string) {
    const exist = await this.techStackRepository.findOneBy({ tech: techName });
    if (exist) throw new BadRequestException('tech stack already exists');
    const { tech } = await this.techStackRepository.save({ tech: techName });
    return tech;
  }
}
