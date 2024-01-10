import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule, MikroOrmMiddleware } from '@mikro-orm/nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import {
  AuthModule,
  HealthModule,
  NestPinoModule,
  TimeoutInterceptor,
} from '@ticketing-app/nest-common';
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { ENVALID, EnvalidModule } from 'nestjs-envalid';
import { Config, validators } from './config';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ENVALID],
      useFactory: (env: Config) => {
        return {
          dbName: 'order-db',
          type: 'mongo',
          autoLoadEntities: true,
          ensureIndexes: true,
          debug: env.isDev,
          clientUrl: env.MONGO_URI,
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ENVALID],
      useFactory: async (env: Config) => ({
        redis: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
    }),
    OrdersModule,
    TicketsModule,
    AuthModule,
    HealthModule,
    NestPinoModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    AppService,
    JwtService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
