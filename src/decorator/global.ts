/* eslint-disable prettier/prettier */
import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/users/schemas/users.interface';

export const IS_PUBLIC_KEY = 'isPublic';
export const RESPONSE_MESSAGE = 'response_message';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);

// TODO: Define User decorator short-hand for request.user
export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as IUser;
})