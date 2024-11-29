import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { InterestResDto } from './dto/res.dto';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { InterestService } from './interest.service';
import { InterestReqDto } from './dto/req.dto';

@ApiTags('Interest')
@ApiBearerAuth()
@ApiExtraModels(InterestResDto)
@Roles(Role.ADMIN)
@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post()
  async appendInterest(@Body() { interestName }: InterestReqDto) {
    return this.interestService.appendInterest(interestName);
  }
}
