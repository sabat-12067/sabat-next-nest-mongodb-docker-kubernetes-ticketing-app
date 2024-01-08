import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Ticket } from '../tickets/entities/ticket.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../config';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Order, User, Ticket] }),
    ClientsModule.register([
      {
        name: 'TICKETS_SERVICE',
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
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService],
})
export class OrdersModule {}
