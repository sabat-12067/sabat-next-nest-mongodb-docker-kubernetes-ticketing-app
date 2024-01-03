import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OidcFactory, jwksClient } from './oidc';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        const key = await jwksClient.getSigningKey();

        return {
          publicKey: key.getPublicKey(),
          verifyOptions: {
            algorithms: ['RS256'],
          },
          global: true,
        };
      },
    }),
  ],
  providers: [OidcFactory, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
