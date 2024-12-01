import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  EmailReqDto,
  SigninReqDto,
  SignupReqDto,
  VerifyTokenReqDto,
} from './dto/req.dto';
import { AuthService } from './auth.service';
import {
  AfterVerifyResDto,
  EmailExistsResDto,
  EmailResDto,
  RefreshResDto,
  SigninResDto,
  SignupResDto,
} from './dto/res.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';
import { Public } from '../common/decorater/public.decorator';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Provider } from './enums/provider.enum';

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

  @Public()
  @Post('check-email')
  @ApiPostResponse(EmailExistsResDto)
  async checkEmail(@Body() { email }: EmailReqDto) {
    return await this.authService.checkEmail(email);
  }

  @Public()
  @Post('request-verification')
  @ApiPostResponse(EmailResDto)
  async sendVerification(@Body() { email }: EmailReqDto) {
    return await this.authService.sendVerification(email);
  }

  @Public()
  @Put('verify-code/:verifyToken')
  @ApiPostResponse(AfterVerifyResDto)
  async checkVerifyToken(
    @Param() { verifyToken }: VerifyTokenReqDto,
    @Body() { email }: EmailReqDto,
  ) {
    await this.authService.verifyEmail(email, verifyToken);
    return { message: 'Email verified' };
  }

  @Public()
  @ApiPostResponse(SignupResDto)
  @Post('signup')
  @Public()
  async signup(@Body() { email, password, verifyToken }: SignupReqDto) {
    return this.authService.signup(email, password, verifyToken);
  }

  @Public()
  @ApiPostResponse(SigninResDto)
  @Post('signin')
  @Public()
  async signIn(@Body() { email, password }: SigninReqDto) {
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
    const { accessToken, refreshToken } = await this.authService.refresh(
      token,
      user.id,
    );
    return { accessToken, refreshToken };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleSignIn(@Req() req: Request) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleSignInCallback(@Req() req: Request) {
    const user = req.user as {
      email: string;
      socialId: string;
      provider: Provider;
      nickname?: string;
    };
    return await this.authService.socialLoginOrSignup(user);
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubSignIn(@Req() req: Request) {}

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('google'))
  async githubSignInCallback(@Req() req: Request) {
    const user = req.user as {
      email: string;
      socialId: string;
      provider: Provider;
      nickname?: string;
    };
    return await this.authService.socialLoginOrSignup(user);
  }

  @Public()
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinSignIn(@Req() req: Request) {}

  @Public()
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinSignInCallback(@Req() req: Request) {
    const user = req.user as {
      email: string;
      socialId: string;
      provider: Provider;
      nickname?: string;
    };
    return await this.authService.socialLoginOrSignup(user);
  }
}
