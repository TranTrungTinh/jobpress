/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/global';
import { Request } from 'express';

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

  handleRequest (err, user, info, context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }

    // TODO: Check user permission
    const hasPermission = this.checkPermission(user, req);

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return user;
  }

  async checkPermission (user, req: Request) {
    const targetMethod = req.method;
    const targetPath = req.route?.path;

    const whiteList = [
      '/auth/login',
      '/auth/logout',
      '/auth/register',
      '/auth/refresh-token',
      '/auth/account',
    ];

    if (whiteList.includes(targetPath)) {
      return true;
    }

    const hasPermission = user?.permissions?.some((item) => {
      const { method, path } = item;
      return method === targetMethod && path === targetPath;
    });

    return hasPermission;
  }
}
