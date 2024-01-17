import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'openid-client';
import { InjectOIDC } from './oidc';

interface IUserInfo {
  sub: string;
  email_verified: boolean;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectOIDC() public openIdClient: Client) {}

  async getUserInfo(accessToken: string) {
    return await this.openIdClient.userinfo<IUserInfo>(accessToken);
  }
}
