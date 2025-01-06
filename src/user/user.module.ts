import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/entity/user.entity';
import { UserService } from './application/user.service';
import { RoleEntity } from './infrastructure/entity/roles.entity';
import { UserRolesEntity } from './infrastructure/entity/user-roles.entity';
import { UserController } from './presentation/user.controller';
import { CommonModule } from '../common/common.module';
import { MenteeModule } from '../mentee/mentee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RoleEntity, UserRolesEntity]),
    CommonModule,
    MenteeModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
