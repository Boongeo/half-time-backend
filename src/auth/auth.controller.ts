import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  SigninReqDto, SignupReqDto,
  VerifyEmailReqDto,
  VerifyTokenReqDto,
} from './dto/req.dto';
import { AuthService } from './auth.service';
import {
  AfterVerifyResDto, RefreshResDto,
  SigninResDto,
  SignupResDto,
  VerifyEmailResDto,
} from './dto/res.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { Public } from '../common/decorater/public.decorator';

@ApiTags('auth')
@ApiExtraModels(
  VerifyEmailResDto,
  AfterVerifyResDto,
  SignupResDto,
  SigninResDto,
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-email')
  @ApiPostResponse(VerifyEmailResDto)
  async sendVerification(@Body() { email }: VerifyEmailReqDto) {
    return await this.authService.sendVerification(email);
  }

  @Put('verify-email/:verifyToken')
  @ApiPostResponse(AfterVerifyResDto)
  async checkVerifyToken(
    @Param() { verifyToken }: VerifyTokenReqDto,
    @Body() { email }: VerifyEmailReqDto,
  ) {
    await this.authService.verifyEmail(email, verifyToken);
    return { message: 'Email verified' };
  }

  @ApiPostResponse(SignupResDto)
  @Post('signup')
  @Public()
  async signup(@Body() { email, password, verifyToken }: SignupReqDto) {
    return this.authService.signup(email, password, verifyToken);
  }

  @ApiPostResponse(SigninResDto)
  @Post('signin')
  @Public()
  async signin(@Body() { email, password }: SigninReqDto) {
    return this.authService.signin(email, password);
  }

  // @ApiPostResponse(RefreshResDto)
  // @ApiBearerAuth()
  // @Post('refresh')
  // async refresh(@Headers('authorization') authorization, @User() user: UserAfterAuth) {
  //   const token = /Bearer\s(.+)/.exec(authorization)[1];
  //   const { accessToken, refreshToken } = await this  .authService.refresh(token, user.id);
  //   return { accessToken, refreshToken };
  // }
}
