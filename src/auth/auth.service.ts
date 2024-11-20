import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Transactional } from 'typeorm-transactional';
import { User } from '../user/entity/user.entity';
import { Account } from './entity/account.entity';
import { TokenType } from './enums/token-type.enum';
import { Payload, SignupResDto } from './dto/res.dto';
import { MailService } from '../mail/mail.service';
import { Role } from '../user/enums/role.enum';
import { RoleEntity } from '../user/entity/roles.entity';
import { UserRolesEntity } from '../user/entity/user-roles.entity';
import { Provider } from './enums/provider.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async checkEmail(email: string) {
    const isUser = await this.accountRepository.findOneBy({ email });
    if (isUser) return { exists: true };
    else return { exists: false };
  }

  async sendVerification(email: string) {
    const verifyToken = this.generateRandomNumber();
    // TODO: Implement the logic to save the verifyToken in the Redis cache
    await this.cacheManager.set(email, verifyToken);
    await this.mailService.sendVerifyToken(email, verifyToken);
  }

  async verifyEmail(email: string, verifyToken: number) {
    const cachedToken = await this.cacheManager.get(email);
    if (!cachedToken) {
      throw new NotFoundException('Token not found');
    } else if (cachedToken !== verifyToken) {
      throw new InternalServerErrorException('Invalid token');
    }
  }

  @Transactional()
  async signup(
    email: string,
    password: string,
    verifyToken: number,
  ): Promise<SignupResDto> {
    const isUser = await this.accountRepository.findOneBy({ email });
    if (isUser) throw new BadRequestException('User already exists');

    const cachedToken = await this.cacheManager.get(email);
    if (Number(cachedToken) !== verifyToken)
      throw new BadRequestException('Invalid token');

    const saltRound = Number(this.configService.get<string>('jwt.salt')) || 10;
    const hash = await bcrypt.hash(password, saltRound);

    // 1. 새로운 User 생성 및 저장
    const user = await this.userRepository.save(this.userRepository.create());

    // 2. UserRolesEntity 생성 및 저장 (기본 Role: USER)
    const role = await this.roleRepository.findOneBy({ role: Role.USER });
    if (!role) throw new Error('Default USER role is not available');

    const userRole = this.userRolesRepository.create({ user, role });
    await this.userRolesRepository.save(userRole);

    // 3. Account 생성 및 저장
    const refreshToken = this.generateRefreshToken({
      sub: user.id,
      tokenType: TokenType.REFRESH,
    });

    await this.accountRepository.save(
      this.accountRepository.create({
        email,
        password: hash,
        user,
        refreshToken,
      }),
    );

    // 4. 캐시에서 인증 토큰 삭제
    await this.cacheManager.del(email);

    // 5. AccessToken 생성 후 반환
    const accessToken = this.generateAccessToken({
      sub: user.id,
      tokenType: TokenType.ACCESS,
    });

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async socialLogin(
    email: string,
    socialId: string,
    provider: Provider,
  ): Promise<SignupResDto> {
    const existingAccount = await this.accountRepository.findOne({
      where: { email, socialId, provider },
      relations: ['user'],
    });

    if (!existingAccount) {
      throw new NotFoundException('Account not found');
    }

    const accessToken = this.generateAccessToken({
      sub: existingAccount.user.id,
      tokenType: TokenType.ACCESS,
    });
    const refreshToken = this.generateRefreshToken({
      sub: existingAccount.user.id,
      tokenType: TokenType.REFRESH,
    });

    existingAccount.refreshToken = refreshToken;
    await this.accountRepository.save(existingAccount);

    return {
      id: existingAccount.user.id,
      accessToken,
      refreshToken,
    };
  }

  async socialSignup(
    email: string,
    socialId: string,
    provider: Provider,
    nickname?: string,
  ): Promise<SignupResDto> {
    const isExistingAccount = await this.accountRepository.findOneBy({ email });
    if (isExistingAccount) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        nickname: nickname,
      }),
    );

    // 3. UserRolesEntity 생성 및 저장 (기본 Role: USER)
    const role = await this.roleRepository.findOneBy({ role: Role.USER });
    if (!role) {
      throw new InternalServerErrorException(
        'Default USER role is not available',
      );
    }

    const userRole = this.userRolesRepository.create({ user, role });
    await this.userRolesRepository.save(userRole);

    // 4. Account 생성 및 저장
    const refreshToken = this.generateRefreshToken({
      sub: user.id,
      tokenType: TokenType.REFRESH,
    });

    await this.accountRepository.save(
      this.accountRepository.create({
        email,
        socialId,
        provider,
        user,
        refreshToken,
      }),
    );

    // 5. AccessToken 생성 후 반환
    const accessToken = this.generateAccessToken({
      sub: user.id,
      tokenType: TokenType.ACCESS,
    });

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async signin(email: string, password: string) {
    const account = await this.accountRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!account || !(await bcrypt.compare(password, account.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken = this.generateAccessToken({
      sub: account.user.id,
      tokenType: TokenType.ACCESS,
    });
    const refreshToken = this.generateRefreshToken({
      sub: account.user.id,
      tokenType: TokenType.REFRESH,
    });

    account.refreshToken = refreshToken;
    await this.accountRepository.save(account);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string, userId: string) {
    const account = await this.accountRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    const accessToken = this.generateAccessToken({
      sub: account.user.id,
      tokenType: TokenType.ACCESS,
    });
    const refreshToken = this.generateAccessToken({
      sub: account.user.id,
      tokenType: TokenType.REFRESH,
    });
    account.refreshToken = refreshToken;
    await this.accountRepository.save(account);
    return { accessToken, refreshToken };
  }

  async handleSocialLoginOrSignup(userInfo: {
    email: string;
    socialId: string;
    provider: Provider;
    nickname?: string;
  }): Promise<SignupResDto> {
    const { email, socialId, provider, nickname } = userInfo;

    const existingAccount = await this.findAccountByEmailAndProvider(email, provider);

    if (existingAccount) {
      return this.socialLogin(email, socialId, provider);
    }

    return this.socialSignup(email, socialId, provider, nickname);
  }

  async findAccountByEmailAndProvider(email: string, social: Provider) {
    return this.accountRepository.findOneBy({ email, provider: social });
  }

  private generateAccessToken(payload: Payload) {
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private generateRefreshToken(payload: Payload) {
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private generateRandomNumber() {
    const minNumber = 100000;
    const maxNumber = 999999;
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }

}
