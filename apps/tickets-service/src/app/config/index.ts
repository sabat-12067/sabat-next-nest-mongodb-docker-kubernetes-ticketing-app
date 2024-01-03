import { cleanEnv, port, str, url } from 'envalid';
import { Inject } from '@nestjs/common';
import { makeValidators, Static, ENVALID } from 'nestjs-envalid';

const ENVS = {
  MONGO_URI: url(),
  ORIGIN: url(),
  PORT: port({ devDefault: 6000 }),
  OPENID_ISSUER: url(),
  OPENID_CLIENT_ID: str(),
  OPENID_CLIENT_SECRET: str(),
  OPENID_JWK_URL: url(),
  FUSIONAUTH_TENANT_ID: str(),
  FUSIONAUTH_URL: url(),
  HOSTNAME: str({ devDefault: 'tickets-service' }),
};

export const env = cleanEnv(process.env, ENVS);

export const validators = makeValidators(ENVS);

export type Config = Static<typeof validators>;

export const InjectEnvalid = () => Inject(ENVALID);
