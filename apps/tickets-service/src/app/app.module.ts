import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule, MikroOrmMiddleware } from '@mikro-orm/nestjs';

import { TicketsModule } from './tickets/tickets.module';
import {
  AuthModule,
  HealthModule,
  NestPinoModule,
  TimeoutInterceptor,
} from '@ticketing-app/nest-common';
import { JwtService } from '@nestjs/jwt';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ENVALID, EnvalidModule } from 'nestjs-envalid';
import { validators, Config } from './config';
import { LoggerErrorInterceptor } from 'nestjs-pino';

@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ENVALID],
      useFactory: (env: Config) => {
        return {
          dbName: 'tickets-db',
          type: 'mongo',
          autoLoadEntities: true,
          ensureIndexes: true,
          debug: env.isDev,
          clientUrl: env.MONGO_URI,
        };
      },
    }),
    TicketsModule,
    AuthModule,
    HealthModule,
    NestPinoModule,
  ],
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
    JwtService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
