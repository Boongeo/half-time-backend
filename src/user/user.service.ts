import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserAfterAuth } from '../common/decorater/user.decorator';
import { RegisterReqDto } from './dto/req.dto';
import { Transactional } from 'typeorm-transactional';
import { UploadService } from '../common/interfaces/upload.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('UploadService')
    private readonly uploadService: UploadService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(userId: string) {
    return await this.userRepository
      .findOneByOrFail({ id: userId })
      .catch(() => {
        throw new NotFoundException('User not found');
      });
  }

  @Transactional()
  async register(
    { id }: UserAfterAuth,
    { nickname }: RegisterReqDto,
    profileImage: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    const filePath = await this.uploadService.uploadFile(profileImage);
    user.nickname = nickname;
    user.profileImage = filePath;
    await this.userRepository.save(user);
    return {
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImage,
    };
  }
}
