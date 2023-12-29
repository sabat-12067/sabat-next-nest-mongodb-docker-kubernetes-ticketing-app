import { EntityRepository } from '@mikro-orm/mongodb';
import { Ticket } from './entities/ticket.entity';
import { Order, OrderStatus } from './entities/order.entity';

export class TicketRepository extends EntityRepository<Ticket> {
  async isReserved(ticket: Ticket) {
    const existingOrder = await this._em.findOne(Order, {
      ticket,
      status: {
        $in: [
          OrderStatus.CREATED,
          OrderStatus.AWAITING_PAYMENT,
          OrderStatus.COMPLETE,
        ],
      },
    });
    console.log(existingOrder);
    return !!existingOrder;
  }
}
