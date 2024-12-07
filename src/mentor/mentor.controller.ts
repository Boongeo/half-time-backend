import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { GetMentorProfilesDto, MentorProfileReqDto } from './dto/req.dto';
import { ApiGetItemsResponse } from '../common/decorater/swagger.decorator';
import {
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

  // @Roles(Role.ADMIN)
  // @Get('mentor-registration')
  // @ApiGetItemsResponse(MentorProfilesResDto)
  // async getMentorProfilesForAdmin(
  //   @Query() getMentorAcceptReqDto: GetMentorAcceptReqDto,
  // ) {
  //   return this.mentorService.getMentorProfilesForAdmin(getMentorProfilesDto);
  // }
}
