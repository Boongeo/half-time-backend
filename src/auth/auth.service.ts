import {
  Inject,
  Injectable,
  InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
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

  private generateRandomNumber() {
    const minNumber = 100000;
    const maxNumber = 999999;
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }
}
