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
} from '@ticketing-app/nest-common';
import { JwtService } from '@nestjs/jwt';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ENVALID, EnvalidModule } from 'nestjs-envalid';
import { validators, Config } from './config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { TempModule } from './temp/temp.module';

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
    TempModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
