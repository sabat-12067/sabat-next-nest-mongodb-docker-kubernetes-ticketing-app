import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule, MikroOrmMiddleware } from '@mikro-orm/nestjs';
import { OidcModule } from '@finastra/nestjs-oidc';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      dbName: 'order-db',
      type: 'mongo',
      autoLoadEntities: true,
      ensureIndexes: true,
      debug: true,
      clientUrl: process.env.MONGO_HOST,
    }),
    OidcModule.forRootAsync({
      useFactory: async () => ({
        issuer: process.env.OIDC_ISSUER,
        clientMetadata: {
          client_id: process.env.OIDC_CLIENT_ID,
          client_secret: process.env.OIDC_CLIENT_SECRET,
        },
        authParams: {
          scope: process.env.OIDC_SCOPE,
        },
        origin: process.env.ORIGIN,
        // Optional properties
        defaultHttpOptions: {
          timeout: 20000,
        },
        externalIdps: {},
        userInfoCallback: async (userId, idpInfos) => {
          return {
            username: userId,
            customUserInfo: 'custom',
          };
        },
      }),
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
