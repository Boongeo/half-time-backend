import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserAfterAuth } from '../common/decorater/user.decorator';
import { UpdateProfileReqDto } from './dto/req.dto';
import { Transactional } from 'typeorm-transactional';
import { UploadService } from '../common/interfaces/upload.service';
import { AfterRoleAssignDto, UserInfoResDto } from './dto/res.dto';
import { MenteeService } from '../mentee/mentee.service';
import { RoleEntity } from './entity/roles.entity';
import { Role } from './enums/role.enum';
import { UserRolesEntity } from './entity/user-roles.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UploadService')
    private readonly uploadService: UploadService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,
    @Inject()
    private readonly menteeService: MenteeService,
  ) {}

  async findUserById(id: string) {
    return this.userRepository.findOneByOrFail({ id });
  }

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
    const userAfterSave = await this.userRepository.save(user);
    return UserInfoResDto.toDto(userAfterAuth, userAfterSave);
  }

  @Transactional()
  async roleAssigned(id: string) {
    const currentUserRoles = await this.userRolesRepository.find({
      where: {
        user: { id },
      },
      relations: ['user', 'role'],
    });

    const admin = await this.roleRepository.findOneByOrFail({
      role: Role.ADMIN,
    });

    if (currentUserRoles.some((userRole) => userRole.role.role === Role.ADMIN))
      throw new BadRequestException('Already assigned');

    await this.userRolesRepository.save({
      user: currentUserRoles[0].user,
      role: admin,
    });

    const updatedUser = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    return AfterRoleAssignDto.toDto(updatedUser);
  }

  async getRoleByEnum(roleEnum: Role) {
    return this.roleRepository.findOneByOrFail({
      role: roleEnum,
    });
  }

  async saveRole(userRole: UserRolesEntity) {
    await this.userRolesRepository.save(userRole);
  }
}
