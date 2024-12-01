import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from './entity/interest.entity';
import { Repository } from 'typeorm';
import { AllInterestResDto } from './dto/res.dto';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
  ) {}

  async appendInterest(interestName: string) {
    const exist = await this.interestRepository.findOneBy({
      interest: interestName,
    });
    if (exist) throw new BadRequestException('interest already exists');
    const { interest } = await this.interestRepository.save({
      interest: interestName,
    });
    return interest;
  }

  async getAllInterests() {
    const interests = await this.interestRepository.find();
    return AllInterestResDto.toDto(interests);
  }
}
