import NextAuth from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';
import type { AuthOptions, TokenSet } from 'next-auth';
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
  callbacks: {
    async session({ session, token }) {
      session.error = token.error;
      return session;
    },
    async jwt({ token, account }) {
      console.log('JWTA', account, token);

      if (account && account.expires_at) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch(`${env.FUSIONAUTH_URL}/oauth2/token`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: env.FUSIONAUTH_CLIENT_ID,
              client_secret: env.FUSIONAUTH_SECRET,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token,
            }),
            method: 'POST',
          });

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;
          console.log('Token refreshed', tokens);

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: tokens.expires_at,
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error('Error refreshing access token', error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const };
        }
      }
    },
  },
  debug: true,
} satisfies AuthOptions;

export default NextAuth(authOptions);

declare module 'next-auth/core/types' {
  interface Session {
    error?: 'RefreshAccessTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    expires_at: number;
    iat: number;
    exp: number;
    jti: string;
    refresh_token: string;
    error?: 'RefreshAccessTokenError';
  }
}
