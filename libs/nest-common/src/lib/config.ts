export const config = Object.freeze({
  jwt: {
    secret: 'definitely_not_a_secret',
  },
  openid: {
    jwkUrl: process.env['OPENID_JWK_URL'],
    issuer: process.env['OPENID_ISSUER'],
    clientId: process.env['OPENID_CLIENT_ID'],
    clientSecret: process.env['OPENID_CLIENT_SECRET'],
  },
});

export default config;
