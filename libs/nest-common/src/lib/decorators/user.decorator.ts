import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { UserinfoResponse } from 'openid-client';

/*
The `LoggedInUser` decorator is used to get the user object from the request object.
*/
export const LoggedInUser = createParamDecorator(
  (data: keyof UserinfoResponse, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as UserinfoResponse;

    return data ? user[data] : user;
  }
);
