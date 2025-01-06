import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infrastructure/entity/account.entity';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { User } from '../user/infrastructure/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { GitHubStrategy } from './strategy/github.strategy';
import { LinkedInStrategy } from './strategy/linkedin.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('jwt.secret'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    TypeOrmModule.forFeature([AccountEntity, User]),
    MailModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
    LinkedInStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
