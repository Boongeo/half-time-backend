import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';
import { PaginatedResult, Result } from '../interfaces/result.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Result<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Result<T>> {
    return next.handle().pipe(
      map((data) => {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();

        if (Array.isArray(data)) {
          const page = Number(request.query['page'] || 1);
          const size = Number(request.query['size'] || 20);
          const paginatedResult: PaginatedResult<T> = {
            items: data,
            page,
            size,
          };
          return {
            success: true,
            data: paginatedResult,
          };
        } else {
          return {
            success: true,
            data,
          };
        }
      }),
    );
  }
}
