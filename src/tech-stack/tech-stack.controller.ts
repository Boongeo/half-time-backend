import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { TechStackResDto } from './dto/res.dto';
import { TechStackReqDto } from './dto/req.dto';
import { TechStackService } from './tech-stack.service';

@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiTags('tech-stack')
@ApiExtraModels(TechStackResDto)
@Controller('tech-stack')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Post()
  @ApiPostResponse(TechStackResDto)
  async appendTechStack(@Body() { techName }: TechStackReqDto) {
    return this.techStackService.appendTechStack(techName);
  }
}
