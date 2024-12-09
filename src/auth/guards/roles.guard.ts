import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseGuard } from './base.guard';
import { Role } from '../../user/enums/role.enum';

@Injectable()
export class RolesGuard extends BaseGuard {
  constructor(protected reflector: Reflector) {
    super(reflector);
  }

  protected handle(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      'ROLES_KEY',
      [context.getHandler(), context.getClass()],
    );

    // 역할 요구사항이 없으면 접근 허용
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 사용자 객체가 없거나 필요한 역할이 없는 경우
    const hasRequiredRole = user?.roles?.some((role: string) =>
      requiredRoles.includes(role as Role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    return true;
  }
}
