import { EntityRepository } from '@mikro-orm/mongodb';
import { Ticket } from './entities/ticket.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '@ticketing-app/nest-common';

export class TicketRepository extends EntityRepository<Ticket> {
  async isReserved(ticket: Ticket) {
    const existingOrder = await this.em.findOne(Order, {
      ticket,
      status: {
        $in: [
          OrderStatus.CREATED,
          OrderStatus.AWAITING_PAYMENT,
          OrderStatus.COMPLETE,
        ],
      },
    });

    return !!existingOrder;
  }
}
