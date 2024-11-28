import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserAfterAuth } from '../common/decorater/user.decorator';
import { UpdateProfileReqDto } from './dto/req.dto';
import { Transactional } from 'typeorm-transactional';
import { UploadService } from '../common/interfaces/upload.service';
import { UserInfoResDto } from './dto/res.dto';
import { MenteeService } from '../mentee/mentee.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('UploadService')
    private readonly uploadService: UploadService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject()
    private readonly menteeService: MenteeService,
  ) {}

  @Transactional()
  async registerProfile(
    userAfterAuth: UserAfterAuth,
    { nickname, interestNames, introduction }: UpdateProfileReqDto,
    profileImage: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOneBy({ id: userAfterAuth.id });
    if (!user) throw new NotFoundException('User not found');
    if (profileImage) {
      user.profileImage = await this.uploadService.uploadFile(profileImage);
    }
    user.nickname = nickname;

    user.mentee = await this.menteeService.createMenteeProfile(
      user,
      interestNames,
      introduction,
    );
    await this.userRepository.save(user);
    return UserInfoResDto.toDto(userAfterAuth, user);
  }

  async findMyProfile(userAfterAuth: UserAfterAuth) {
    const user = await this.userRepository
      .findOneByOrFail({ id: userAfterAuth.id })
      .catch(() => {
        throw new NotFoundException('User not found');
      });
    return UserInfoResDto.toDto(userAfterAuth, user);
  }

  @Transactional()
  async updateProfile(
    userAfterAuth: UserAfterAuth,
    { nickname }: UpdateProfileReqDto,
    profileImage: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOneBy({ id: userAfterAuth.id });
    if (!user) throw new NotFoundException('User not found');
    if (profileImage)
      user.profileImage = await this.uploadService.updateFile(
        profileImage,
        user.profileImage,
      );
    user.nickname = nickname;
    const userAfterSave = await this.userRepository.save(user)
    return UserInfoResDto.toDto(userAfterAuth, userAfterSave);
  }
}
