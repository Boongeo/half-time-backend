import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../user/enums/role.enum';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export interface UserAfterAuth {
  id: string;
  nickname?: string;
  roles: Role[];
}
