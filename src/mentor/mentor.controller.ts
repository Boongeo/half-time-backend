import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiTags } from '@nestjs/swagger';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { GetMentorAcceptReqDto, GetMentorProfilesDto, MentorProfileReqDto, MentorRejectReqDto } from './dto/req.dto';
import { ApiGetItemsResponse, ApiGetResponse } from '../common/decorater/swagger.decorator';
import {
  AdminMentorRegistrationResDto, AdminMentorResDto,
  MentorProfileResDto,
  MentorProfilesResDto,
  MentorStatusResDto,
  MyMentorProfileResDto,
} from './dto/res.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('mentors')
@ApiBearerAuth()
@ApiExtraModels(
  MyMentorProfileResDto,
  MentorProfilesResDto,
  MentorProfileReqDto,
  MentorStatusResDto,
  AdminMentorRegistrationResDto,
  AdminMentorResDto,
)
@Roles(Role.USER)
@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post('mentor-registration')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Please submit proof of employment',
    type: MentorProfileReqDto,
  })
  @UseInterceptors(FileInterceptor('careerProof'))
  async createMentorProfile(
    @User() userAfterAuth: UserAfterAuth,
    @Body() mentorProfileReqDto: MentorProfileReqDto,
    @UploadedFile() careerProof: Express.Multer.File,
  ) {
    return this.mentorService.createMentorProfile(
      userAfterAuth,
      mentorProfileReqDto,
      careerProof,
    );
  }

  @Get('mentor-registration/status')
  @ApiGetItemsResponse(MentorStatusResDto)
  async getMentorStatus(@User() userAfterAuth: UserAfterAuth) {
    return this.mentorService.getMyMentorStatus(userAfterAuth);
  }

  @Get()
  @ApiGetItemsResponse(MentorProfileResDto)
  async getFirstMentorProfiles(
    @Query() getMentorProfilesDto: GetMentorProfilesDto,
  ) {
    return this.mentorService.getMentorProfiles(getMentorProfilesDto);
  }

  @Get('search')
  @ApiGetItemsResponse(MentorProfileResDto)
  async getMentorProfiles(@Query() getMentorProfilesDto: GetMentorProfilesDto) {
    return this.mentorService.getMentorProfiles(getMentorProfilesDto);
  }

  @Roles(Role.ADMIN)
  @Get('mentor-registration')
  @ApiGetItemsResponse(AdminMentorRegistrationResDto)
  async getMentorProfilesForAdmin(
    @Query() getMentorAcceptReqDto: GetMentorAcceptReqDto,
  ) {
    console.log(getMentorAcceptReqDto);
    return this.mentorService.getMentorProfilesForAdmin(getMentorAcceptReqDto);
  }

  @Roles(Role.ADMIN)
  @Get('admin/mentor-registrations/:mentorId')
  @ApiGetItemsResponse(AdminMentorResDto)
  @ApiParam({ name: 'mentorId', type: String, description: 'ID of the mentor' })
  async getMentorInfo(@Param('mentorId') mentorId: string) {
    return this.mentorService.getMentorDetailProfile(mentorId);
  }

  @Roles(Role.ADMIN)
  @Post(':mentorId/approve')
  @ApiParam({ name: 'mentorId', type: String, description: 'ID of the mentor' })
  async approveMentorProfile(@Param('mentorId') mentorId: string) {
    return this.mentorService.approveMentorProfile(mentorId);
  }

  @Roles(Role.ADMIN)
  @Post(':mentorId/reject')
  @ApiParam({ name: 'mentorId', type: String, description: 'ID of the mentor' })
  async rejectMentorProfile(
    @Param('mentorId') mentorId: string,
    @Body() mentorRejectReqDto: MentorRejectReqDto,
  ) {
    return this.mentorService.rejectMentorProfile(mentorId, mentorRejectReqDto);
  }

  @Roles(Role.ADMIN)
  @Get(':mentorId')
  @ApiGetResponse(MentorProfileReqDto)
  @ApiParam({ name: 'mentorId', type: String, description: 'ID of the mentor' })
  async getMentorProfile(@Param('mentorId') mentorId: string) {
    return this.mentorService.getMentorProfile(mentorId);
  }
}
