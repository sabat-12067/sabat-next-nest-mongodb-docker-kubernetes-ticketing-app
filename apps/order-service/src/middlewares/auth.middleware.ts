import { LOGIN_SESSION_COOKIE } from '@finastra/nestjs-oidc';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    // If the request is authenticated, do nothing
    if (req.isAuthenticated()) {
      return next();
    }

    // Add the LOGIN_SESSION_COOKIE to make sure to prompt the login page if the user has already authenticated before
    res.cookie(LOGIN_SESSION_COOKIE, 'logging in', {
      maxAge: 15 * 1000 * 60,
    });

    // If you want to send the query params to the login middleware
    const searchParams = new URLSearchParams(req.query);

    // If you're using the multitenancy authentication, you'll need to get the prefix
    const channelType = req.params.channelType;
    const tenantId = req.params.tenantId;
    const prefix = `${tenantId}/${channelType}`;

    // Redirect to login page and forward the request query params, after logging in, redirect to the redirect_url parameter
    res.redirect(
      `/${prefix}/login?redirect_url=${req.url}&${searchParams.toString()}`
    );
  }
}
