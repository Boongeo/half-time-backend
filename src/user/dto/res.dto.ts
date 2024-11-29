import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { UserAfterAuth } from '../../common/decorater/user.decorator';
import { User } from '../entity/user.entity';
import { UserRolesEntity } from '../entity/user-roles.entity';

export class UserInfoResDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: true })
  roles: Role[];

  @ApiProperty({ required: true })
  profileImage?: string;

  static toDto(userAfterAuth: UserAfterAuth, user: User) {
    return {
      email: userAfterAuth.email,
      nickname: user.nickname,
      roles: userAfterAuth.roles,
      profileImage: user.profileImage,
    };
  }
}

export class AfterRoleAssignDto {
  @ApiProperty({ required: true })
  nickname: string;

  @ApiProperty({ required: true })
  roles: Role[];

  static toDto(user: User) {
    return {
      nickname: user.nickname,
      roles: user.userRoles.map((userRole) => userRole.role.role),
    };
  }
}
