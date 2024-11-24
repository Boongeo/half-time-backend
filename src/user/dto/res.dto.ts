import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { UserAfterAuth } from '../../common/decorater/user.decorator';
import { User } from '../entity/user.entity';

export class RegisterResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: true })
  profileImage: string;
}

export class MyInfoResDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: true })
  roles: Role[];

  @ApiProperty({ required: true })
  profileImage: string;

  @ApiProperty({ required: true })
  isProfileComplete: boolean;

  static toDto(userAfterAuth: UserAfterAuth, user: User) {
    return {
      email: userAfterAuth.email,
      nickname: user.nickname,
      roles: userAfterAuth.roles,
      profileImage: user.profileImage,
      isProfileComplete: true,
    };
  }
}
