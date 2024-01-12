import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { constants } from '@ticketing-app/nest-common';
import { env } from '../config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Payment, Order] }),
    ClientsModule.register([
      {
        name: constants.ORDER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [env.RABBIT_MQ_URI],
          queue: constants.queues.orders_queue,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, JwtService],
})
export class PaymentModule {}
