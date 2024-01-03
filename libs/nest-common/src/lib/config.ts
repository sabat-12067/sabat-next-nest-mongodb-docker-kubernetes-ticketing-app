import { cleanEnv, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  OPENID_JWK_URL: url(),
  OPENID_ISSUER: url(),
  OPENID_CLIENT_ID: str(),
  OPENID_CLIENT_SECRET: str(),
});

export const config = Object.freeze({
  openid: {
    jwkUrl: env.OPENID_JWK_URL,
    issuer: env.OPENID_ISSUER,
    clientId: env.OPENID_CLIENT_ID,
    clientSecret: env.OPENID_CLIENT_SECRET,
  },
});

export default config;
