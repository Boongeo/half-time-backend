import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { UserAfterAuth } from '../../common/decorater/user.decorator';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any): Promise<UserAfterAuth> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['userRoles', 'userRoles.role'], // RoleEntity까지 로드
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // user.userRoles에서 RoleEntity의 role 값을 추출하여 배열 생성
    const roles = user.userRoles.map((userRole) => userRole.role.role);

    return {
      id: user.id,
      nickname: user.nickname,
      roles,
    };
  }
}
