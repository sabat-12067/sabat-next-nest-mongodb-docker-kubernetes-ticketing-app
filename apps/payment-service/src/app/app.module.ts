import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import {
  AuthModule,
  HealthModule,
  NestPinoModule,
  TimeoutInterceptor,
} from '@ticketing-app/nest-common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ENVALID, EnvalidModule } from 'nestjs-envalid';
import { Config, validators } from './config';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { PaymentModule } from './payment/payment.module';
// import { OrderModule } from './order/order.module';

@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ENVALID],
      useFactory: (env: Config) => {
        return {
          dbName: 'payments-db',
          driver: MongoDriver,
          autoLoadEntities: true,
          ensureIndexes: true,
          debug: env.isDev,
          clientUrl: env.MONGO_URI,
        };
      },
    }),
    AuthModule,
    HealthModule,
    NestPinoModule,
    PaymentModule,
    // OrderModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    JwtService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
