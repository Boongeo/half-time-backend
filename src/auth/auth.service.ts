import {
  BadRequestException,
  Inject,
  Injectable, InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../user/entity/roles.entity';
import { Repository } from 'typeorm';
import { UserRolesEntity } from '../user/entity/user-roles.entity';
import { User } from '../user/entity/user.entity';
import { Account } from './entity/account.entity';
import { Transactional } from 'typeorm-transactional';
import { Payload, SignupResDto } from './dto/res.dto';
import { Role } from '../user/enums/role.enum';
import { Provider } from './enums/provider.enum';
import * as bcrypt from 'bcrypt';
import { TokenType } from './enums/token-type.enum';

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

  // 이메일 중복 체크
  async checkEmail(email: string) {
    return { exists: !!(await this.accountRepository.findOneBy({ email })) };
  }

  // 이메일 인증 토큰 생성 및 전송
  async sendVerification(email: string) {
    const verifyToken = this.generateRandomNumber();
    await this.cacheManager.set(email, verifyToken);
    await this.mailService.sendVerifyToken(email, verifyToken);
  }

  // 이메일 인증
  async verifyEmail(email: string, verifyToken: number) {
    const cachedToken = await this.cacheManager.get(email);
    if (!cachedToken) throw new NotFoundException('Token not found');
    if (Number(cachedToken) !== verifyToken)
      throw new BadRequestException('Invalid token');
  }

  @Transactional()
  async signup(
    email: string,
    password: string,
    verifyToken: number,
  ): Promise<SignupResDto> {
    // 이메일 중복 확인
    if (await this.accountRepository.findOneBy({ email })) {
      throw new BadRequestException('User already exists');
    }

    // 이메일 인증 토큰 확인
    await this.verifyEmail(email, verifyToken);

    // 비밀번호 해싱
    const hash = await this.hashPassword(password);

    // 사용자 생성 및 역할 할당
    const user = await this.createUserWithRole(Role.USER);

    // 계정 생성 및 저장
    const { refreshToken, accessToken } = await this.createAccount({
      email,
      password: hash,
      user,
    });

    // 인증 토큰 삭제
    await this.cacheManager.del(email);

    return { id: user.id, accessToken, refreshToken };
  }

  async socialLoginOrSignup(userInfo: {
    email: string;
    socialId: string;
    provider: Provider;
  }): Promise<SignupResDto> {
    const { email, socialId, provider } = userInfo;

    // 기존 계정이 있는지 확인
    const existingAccount = await this.findAccountByEmailAndProvider(
      email,
      provider,
    );
    if (existingAccount) {
      return this.generateTokensForAccount(existingAccount);
    }

    // 새 계정 생성
    const user = await this.createUserWithRole(Role.USER);

    const { refreshToken, accessToken } = await this.createAccount({
      email,
      socialId,
      provider,
      user,
    });

    return { id: user.id, accessToken, refreshToken };
  }

  async signin(email: string, password: string) {
    const account = await this.findAccountByEmail(email);
    if (!account || !(await bcrypt.compare(password, account.password))) {
      throw new BadRequestException('Invalid email or password');
    }
    return this.generateTokensForAccount(account);
  }

  async refresh(token: string, userId: string) {
    const account = await this.accountRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!account) throw new NotFoundException('Account not found');
    return this.generateTokensForAccount(account);
  }

  // Private 헬퍼 메서드
  private async hashPassword(password: string): Promise<string> {
    const saltRound = Number(this.configService.get<string>('jwt.salt')) || 10;
    return bcrypt.hash(password, saltRound);
  }

  private async createUserWithRole(roleType: Role): Promise<User> {
    const user = await this.userRepository.save(this.userRepository.create());
    const role = await this.roleRepository.findOneBy({ role: roleType });
    if (!role) throw new InternalServerErrorException('Role not found');
    await this.userRolesRepository.save(
      this.userRolesRepository.create({ user, role }),
    );
    return user;
  }

  private async createAccount(accountData: Partial<Account>) {
    const refreshToken = this.generateRefreshToken({
      sub: accountData.user.id,
      tokenType: TokenType.REFRESH,
    });
    const account = await this.accountRepository.save(
      this.accountRepository.create({ ...accountData, refreshToken }),
    );
    account.refreshToken = refreshToken;
    await this.accountRepository.save(account);

    const accessToken = this.generateAccessToken({
      sub: account.user.id,
      tokenType: TokenType.ACCESS,
    });

    return { accessToken, refreshToken };
  }

  private async findAccountByEmail(email: string) {
    return this.accountRepository.findOne({
      where: { email },
      relations: ['user'],
    });
  }

  private async findAccountByEmailAndProvider(
    email: string,
    provider: Provider,
  ) {
    return this.accountRepository.findOneBy({ email, provider });
  }

  private async generateTokensForAccount(account: Account) {
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

    return { id: account.user.id, accessToken, refreshToken };
  }

  private generateAccessToken(payload: Payload) {
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private generateRefreshToken(payload: Payload) {
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000); // 6자리 랜덤 숫자
  }
}
