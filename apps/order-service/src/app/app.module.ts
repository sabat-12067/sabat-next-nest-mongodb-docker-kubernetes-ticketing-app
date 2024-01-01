import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule, MikroOrmMiddleware } from '@mikro-orm/nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { AuthGuard, AuthModule } from '@ticketing-app/nest-common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      dbName: 'order-db',
      type: 'mongo',
      autoLoadEntities: true,
      ensureIndexes: true,
      debug: true,
      clientUrl: process.env.MONGO_URI,
    }),
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
