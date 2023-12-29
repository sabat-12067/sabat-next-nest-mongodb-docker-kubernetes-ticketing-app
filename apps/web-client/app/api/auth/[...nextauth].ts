import NextAuth from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';

console.log(process.env);

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FusionAuthProvider({
      id: 'fusionauth',
      name: 'FusionAuth',
      issuer: process.env.FUSIONAUTH_ISSUER,
      clientId: process.env.FUSIONAUTH_CLIENT_ID,
      clientSecret: process.env.FUSIONAUTH_SECRET,
      tenantId: process.env.FUSIONAUTH_TENANT_ID,
    }),
  ],
};

export default NextAuth(authOptions);
