import NextAuth from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';
import type { AuthOptions } from 'next-auth';
import { env } from '../../../utils';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FusionAuthProvider({
      issuer: env.FUSIONAUTH_ISSUER,
      clientId: env.FUSIONAUTH_CLIENT_ID,
      clientSecret: env.FUSIONAUTH_SECRET,
      wellKnown: `${env.FUSIONAUTH_URL}/.well-known/openid-configuration/${env.FUSIONAUTH_TENANT_ID}`,
      tenantId: env.FUSIONAUTH_TENANT_ID,
    }),
  ],
  debug: env.NODE_ENV === 'development',
} satisfies AuthOptions;

export default NextAuth(authOptions);
