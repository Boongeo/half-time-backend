import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends BaseGuard {
  constructor(
    reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super(reflector); // BaseGuard 초기화
  }

  protected async handle(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const authorization = request.headers['authorization'];
    const token = /Bearer\s(.+)/.exec(authorization)?.[1];

    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }

    try {
      // JWT 토큰 검증 및 디코딩
      request.user = this.jwtService.verify(token); // 사용자 정보를 request.user에 설정
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
