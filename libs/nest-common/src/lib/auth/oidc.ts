import { Inject } from '@nestjs/common';
import { Issuer } from 'openid-client';
import { JwksClient } from 'jwks-rsa';
import config from '../config';

const buildOpenIdClient = async () => {
  const TrustIssuer = await Issuer.discover(
    `${config.openid.issuer}/.well-known/openid-configuration`
  );

  return new TrustIssuer.Client({
    client_id: config.openid.clientId,
    client_secret: config.openid.clientSecret,
  });
};

const OIDC = 'OIDC';
export const InjectOIDC = () => Inject(OIDC);

export const OidcFactory = {
  provide: OIDC,
  useFactory: async () => {
    return await buildOpenIdClient();
  },
};

export const jwksClient = new JwksClient({
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // Defaults to 10m
  jwksUri: config.openid.jwkUrl,
});
