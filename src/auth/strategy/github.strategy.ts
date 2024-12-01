import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-github2';
import { Provider } from '../enums/provider.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('authSecret.github_client_id'),
      clientSecret: configService.get('authSecret.github_client_secret'),
      callbackURL: configService.get('authSecret.github_callback_url'),
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('profile', profile);
    const { emails, id } = profile;
    const email = emails[0].value;
    return this.authService.socialLoginOrSignup({
      email,
      socialId: id,
      provider: Provider.GITHUB,
    });
  }
}
