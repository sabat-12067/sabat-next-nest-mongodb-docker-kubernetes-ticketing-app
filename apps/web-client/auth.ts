import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';
import { env } from './utils';
import type { JWT } from 'next-auth/jwt';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
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
  events: {
    signOut(message) {
      console.log(message);
    },
  },

  callbacks: {
    async session({ session, token, trigger, newSession }) {
      session.error = token.error;
      session.access_token = token.access_token;
      if (trigger === 'update' && newSession?.name) {
        // You can update the session in the database if it's not already updated.
        // await adapter.updateUser(session.user.id, { name: newSession.name })

        // Make sure the updated value is reflected on the client
        session.name = newSession.name;
      }
      return session;
    },
    async jwt({ token, account }) {
      let result: JWT;
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
      }

      if (
        account &&
        account.expires_at &&
        account.access_token &&
        account.refresh_token
      ) {
        // Save the access token and refresh token in the JWT on the initial login
        result = {
          ...token,
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

          const tokens: AuthResponse = await response.json();

          if (!response.ok) throw tokens;
          console.debug('Token refreshed', tokens);

          result = {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
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

      return result;
    },
  },
  debug: true,
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

interface AuthResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  refresh_token_id: string;
  scope: string;
  token_type: string;
  userId: string;
}

declare module 'next-auth/core/types' {
  interface Session {
    name?: string;
    access_token: string;
    error?: 'RefreshAccessTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: 'RefreshAccessTokenError';
  }
}
