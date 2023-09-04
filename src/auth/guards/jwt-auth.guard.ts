/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/global';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor (private reflector: Reflector) {
    super();
  }

   canActivate (context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // TODO: check if isPublic is true, then return true
    return isPublic || super.canActivate(context) as boolean;
  }

  handleRequest (err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
