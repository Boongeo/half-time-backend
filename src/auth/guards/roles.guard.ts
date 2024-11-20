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

    if (!requiredRoles) {
      return true; // 역할 검증이 필요 없으면 통과
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true; // 역할 검증 성공
  }
}
