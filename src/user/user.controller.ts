import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from './enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindUserReqDto, UpdateProfileReqDto } from './dto/req.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { AfterRoleAssignDto, UserInfoResDto } from './dto/res.dto';

@Roles(Role.USER)
@ApiBearerAuth()
@ApiExtraModels(UserInfoResDto, AfterRoleAssignDto)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User registration with optional profile image',
    type: UpdateProfileReqDto,
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @User() user: UserAfterAuth,
    @Body() updateProfileReqDto: UpdateProfileReqDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    return this.userService.registerProfile(
      user,
      updateProfileReqDto,
      profileImage,
    );
  }

  @Get('me')
  @ApiPostResponse(UserInfoResDto)
  async me(@User() userAfterAuth: UserAfterAuth) {
    return await this.userService.findMyProfile(userAfterAuth);
  }

  @Patch('me')
  @ApiPostResponse(UserInfoResDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User registration with profile image',
    type: UpdateProfileReqDto,
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateMyProfile(
    @User() user: UserAfterAuth,
    @Body() nickname: UpdateProfileReqDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    return this.userService.updateProfile(user, nickname, profileImage);
  }

  @Roles(Role.ADMIN)
  @Patch('role-assigned')
  @ApiPostResponse(AfterRoleAssignDto)
  async roleAssigned(@Body() { id }: FindUserReqDto) {
    return this.userService.roleAssigned(id);
  }
}
