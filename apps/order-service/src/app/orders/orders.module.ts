import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order.entity';
import { JwtService } from '@nestjs/jwt';
import { Ticket } from '../tickets/entities/ticket.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../config';
import { BullModule } from '@nestjs/bull';
import constants from './constants';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Order, Ticket] }),
    ClientsModule.register([
      {
        name: constants.TICKETS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [env.RABBIT_MQ_URI],
          queue: 'tickets_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    BullModule.registerQueue({
      name: constants.EXPIRE_ORDER,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService, OrderProcessor],
})
export class OrdersModule {}
