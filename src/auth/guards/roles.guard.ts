import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseGuard } from './base.guard';
import { Role } from '../../user/enums/role.enum';

@Injectable()
export class RolesGuard extends BaseGuard {
  constructor(reflector: Reflector) {
    super(reflector); // BaseGuard 초기화
  }

  protected handle(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      'ROLES_KEY',
      [context.getHandler(), context.getClass()],
    );
    console.log(requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);
    console.log(user);
    console.log(user);

    if (
      !user ||
      !user.roles.some((role: string) => requiredRoles.includes(role as Role))
    ) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
