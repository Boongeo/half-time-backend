import { Body, Controller, Get, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from './enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterReqDto } from './dto/req.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { MyInfoResDto, RegisterResDto } from './dto/res.dto';

@Roles(Role.USER)
@ApiBearerAuth()
@ApiExtraModels(RegisterResDto, MyInfoResDto)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiPostResponse(RegisterResDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User registration with profile image',
    type: RegisterReqDto,
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @User() user: UserAfterAuth,
    @Body() nickname: RegisterReqDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return this.userService.register(user, nickname, profileImage);
  }

  @Get('me')
  @ApiPostResponse(MyInfoResDto)
  async me(@User() userAfterAuth: UserAfterAuth) {
    return await this.userService.findMyProfile(userAfterAuth);
  }
}
