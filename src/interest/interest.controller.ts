import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AllInterestResDto, InterestResDto } from './dto/res.dto';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { InterestService } from './interest.service';
import { InterestReqDto } from './dto/req.dto';
import { ApiGetResponse } from '../common/decorater/swagger.decorator';
import { Public } from '../common/decorater/public.decorator';

@Roles(Role.USER)
@ApiTags('Interest')
@ApiBearerAuth()
@ApiExtraModels(InterestResDto, AllInterestResDto)
@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post()
  @Roles(Role.ADMIN)
  async appendInterest(@Body() { interestName }: InterestReqDto) {
    return this.interestService.appendInterest(interestName);
  }

  @Get()
  @Public()
  @ApiGetResponse(AllInterestResDto)
  async getAllInterests() {
    return this.interestService.getAllInterests();
  }
}
