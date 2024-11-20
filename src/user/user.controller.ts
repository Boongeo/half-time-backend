import { Controller, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/roles.decorator';
import { Role } from './enums/role.enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Roles(Role.USER)
  @ApiBearerAuth()
  @Get('test')
  async decoratorTest(@User() user: UserAfterAuth) {
    console.log(user.id);
    console.log(user.roles);
    console.log(user.nickname);
  }
}
