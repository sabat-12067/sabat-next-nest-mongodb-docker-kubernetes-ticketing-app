import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order.entity';
import { Ticket } from './entities/ticket.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Order, Ticket, User] })],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
