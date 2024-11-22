import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';  // 여기가 변경됨
import { Provider } from '../enums/provider.enum';
import { SignupResDto } from '../dto/res.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('authSecret.google_client_id'),
      clientSecret: configService.get<string>(
        'authSecret.google_client_secret',
      ),
      callbackURL: configService.get<string>('authSecret.google_callback_url'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<SignupResDto> {
    const { emails, id } = profile;
    const email = emails[0].value;

    return this.authService.socialLoginOrSignup({
      email,
      socialId: id,
      provider: Provider.GOOGLE,
    });
  }
}
