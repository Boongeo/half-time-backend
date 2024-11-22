import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-linkedin-oauth2';
import { Provider } from '../enums/provider.enum';
import { SignupResDto } from '../dto/res.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('authSecret.linkedin_client_id'),
      clientSecret: configService.get<string>(
        'authSecret.linkedin_client_secret',
      ),
      callbackURL: configService.get<string>(
        'authSecret.linkedin_callback_url',
      ),
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile, // LinkedIn Profile Type
  ): Promise<SignupResDto> {
    const { emails, id } = profile;
    const email = emails[0].value;

    return this.authService.handleSocialLoginOrSignup({
      email,
      socialId: id,
      provider: Provider.LINKEDIN,
    });
  }
}
