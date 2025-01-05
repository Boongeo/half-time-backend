import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../user/common/enums/role.enum';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export interface UserAfterAuth {
  id: string;
  email: string;
  roles: Role[];
}
