import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Ticket } from './entities/ticket.entity';
import { JwtService } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../config';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Ticket] }),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [env.RABBIT_MQ],
          queue: 'order_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, JwtService],
})
export class TicketsModule {}
