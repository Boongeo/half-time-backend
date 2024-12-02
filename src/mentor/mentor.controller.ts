import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { GetMentorProfilesDto, MentorProfileReqDto } from './dto/req.dto';
import {
  ApiGetItemsResponse,
  ApiPostResponse,
} from '../common/decorater/swagger.decorator';
import { MentorProfilesResDto, MyMentorProfileResDto } from './dto/res.dto';

@ApiTags('mentors')
@ApiBearerAuth()
@ApiExtraModels(
  MyMentorProfileResDto,
  MentorProfilesResDto,
  MentorProfileReqDto,
)
@Roles(Role.USER)
@Controller('mentors')
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

  @Get()
  @ApiGetItemsResponse(MentorProfilesResDto)
  async getFirstMentorProfiles(
    @Query() getMentorProfilesDto: GetMentorProfilesDto,
  ) {
    return this.mentorService.getMentorProfiles(getMentorProfilesDto);
  }

  @Get('search')
  @ApiGetItemsResponse(MentorProfilesResDto)
  async getMentorProfiles(@Query() getMentorProfilesDto: GetMentorProfilesDto) {
    return this.mentorService.getMentorProfiles(getMentorProfilesDto);
  }

  @Get(':mentorId')
  @ApiGetItemsResponse(MentorProfileReqDto)
  async getMentorProfile(@Query() mentorId: number) {
    return this.mentorService.getMentorProfile(mentorId);
  }
}
