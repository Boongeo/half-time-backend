import { BadRequestException, Body, Controller, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  SigninReqDto,
  SignupReqDto,
  EmailReqDto,
  VerifyTokenReqDto,
} from './dto/req.dto';
import { AuthService } from './auth.service';
import {
  AfterVerifyResDto,
  RefreshResDto,
  SigninResDto,
  SignupResDto,
  EmailResDto,
  EmailExistsResDto,
} from './dto/res.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { Public } from '../common/decorater/public.decorator';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';

@ApiTags('auth')
@ApiExtraModels(
  EmailResDto,
  AfterVerifyResDto,
  SignupResDto,
  SigninResDto,
  RefreshResDto,
  EmailExistsResDto,
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-email')
  @ApiPostResponse(EmailExistsResDto)
  async checkEmail(@Body() { email }: EmailReqDto) {
    return await this.authService.checkEmail(email);
  }

  @Post('request-verification')
  @ApiPostResponse(EmailResDto)
  async sendVerification(@Body() { email }: EmailReqDto) {
    return await this.authService.sendVerification(email);
  }

  @Put('verify-code/:verifyToken')
  @ApiPostResponse(AfterVerifyResDto)
  async checkVerifyToken(
    @Param() { verifyToken }: VerifyTokenReqDto,
    @Body() { email }: EmailReqDto,
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

  @ApiPostResponse(RefreshResDto)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization: string,
    @User() user: UserAfterAuth,
  ) {
    const token = /Bearer\s(.+)/.exec(authorization)?.[1];
    if (!token) {
      throw new BadRequestException('Invalid authorization header');
    }
    const { accessToken, refreshToken } = await this.authService.refresh(token, user.id);
    return { accessToken, refreshToken };
  }
}
