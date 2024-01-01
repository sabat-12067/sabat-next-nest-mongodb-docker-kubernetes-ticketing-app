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
  openIdClient: Client;
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectOIDC() openIdClient: Client) {
    this.openIdClient = openIdClient;
  }

  async getUserInfo(accessToken: string) {
    return await this.openIdClient.userinfo<IUserInfo>(accessToken);
  }
}
