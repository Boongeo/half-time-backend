import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async sendVerification(email: string) {
    const verifyToken = this.generateRandomNumber();
    // TODO: Implement the logic to save the verifyToken in the Redis cache
    await this.cacheManager.set(email, verifyToken);
    await this.mailService.sendVerifyToken(email, verifyToken);
  }

  async verifyEmail(email: string, verifyToken: number) {
    const cachedToken = await this.cacheManager.get(email);
    console.log(cachedToken, verifyToken);
    console.log(typeof cachedToken, typeof verifyToken);
    if (!cachedToken) {
      throw new NotFoundException('Token not found');
    } else if (cachedToken !== verifyToken) {
      throw new InternalServerErrorException('Invalid token');
    } else {
      await this.cacheManager.del(email);
    }
  }

  async validateAccount(email: string, password: string) {
    const account = await this.accountRepository.findOneOrFail({
      where: { email },
      relations: ['user'],
    });
    if (account && account.password === password) {
      return account;
    }
    return null;
  }

  private generateRandomNumber() {
    const minNumber = 100000;
    const maxNumber = 999999;
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }
}
