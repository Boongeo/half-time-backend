import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPostResponse,
} from '../common/decorater/swagger.decorator';
import { AllTechStackResDto, TechStackResDto } from './dto/res.dto';
import { TechStackReqDto } from './dto/req.dto';
import { TechStackService } from './tech-stack.service';
import { Public } from '../common/decorater/public.decorator';

@ApiTags('tech-stack')
@ApiExtraModels(TechStackResDto, AllTechStackResDto)
@Controller('tech-stack')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiPostResponse(TechStackResDto)
  async appendTechStack(@Body() { techName }: TechStackReqDto) {
    return this.techStackService.appendTechStack(techName);
  }

  @Get()
  @Public()
  @ApiGetResponse(AllTechStackResDto)
  async getAllTechStacks() {
    return this.techStackService.getAllTechStacks();
  }
}
