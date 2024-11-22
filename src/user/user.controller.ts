import { Body, Controller, Get, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from './enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterReqDto } from './dto/req.dto';

@Roles(Role.USER)
@ApiBearerAuth()
@ApiExtraModels()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get('test')
  async decoratorTest(@User() user: UserAfterAuth) {
    console.log(user);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User registration with profile image',
    type: RegisterReqDto,
  })
  async register(
    @User() user: UserAfterAuth,
    @Body() nickname: RegisterReqDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    console.log(user);
    console.log(nickname);
    console.log(profileImage);
    return this.userService.register(user, nickname, profileImage);
  }
}
