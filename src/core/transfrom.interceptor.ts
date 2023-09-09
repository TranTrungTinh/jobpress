/* eslint-disable prettier/prettier */

import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { RESPONSE_MESSAGE } from "src/decorator/global";

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const message = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler());
    return next.handle().pipe(
      map(data => ({
        statusCode: response.statusCode,
        message: message || '',
        data,
      })
    ))
  }
}
