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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

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

    const user = await this.userRepository.save(this.userRepository.create());
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

    await this.cacheManager.del(email);

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
