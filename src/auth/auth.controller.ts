import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { VerifyEmailReqDto, VerifyTokenReqDto } from './dto/req.dto';
import { AuthService } from './auth.service';
import { AfterVerifyResDto, VerifyEmailResDto } from './dto/res.dto';
import { ApiPostResponse } from '../common/decorater/swagger.decorator';


@ApiTags('auth')
@ApiExtraModels(VerifyEmailResDto, AfterVerifyResDto)
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
}
