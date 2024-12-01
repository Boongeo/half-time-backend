import { Body, Controller, Post } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { MentorProfileReqDto } from './dto/req.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { MyMentorProfileResDto } from './dto/res.dto';

@ApiTags('mentor')
@ApiBearerAuth()
@ApiExtraModels(MyMentorProfileResDto)
@Roles(Role.USER)
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post('register')
  @ApiPostResponse(MyMentorProfileResDto)
  async createMentorProfile(
    @User() userAfterAuth: UserAfterAuth,
    @Body()
    { techStackNames, interestNames, introduction }: MentorProfileReqDto,
  ) {
    return this.mentorService.createMentorProfile(
      userAfterAuth,
      interestNames,
      techStackNames,
      introduction,
    );
  }
}
