import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export abstract class BaseGuard implements CanActivate {
  protected reflector: Reflector; // protected로 변경하여 하위 클래스에서 접근 가능

  constructor(reflector: Reflector) {
    this.reflector = reflector;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'IS_PUBLIC_KEY',
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true; // 공개 경로는 인증 없이 접근 허용
    }

    // 하위 클래스에서 처리할 메서드 호출
    return this.handle(context);
  }

  protected abstract handle(
    context: ExecutionContext,
  ): Promise<boolean> | boolean;
}
