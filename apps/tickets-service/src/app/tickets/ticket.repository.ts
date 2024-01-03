import { EntityRepository } from '@mikro-orm/mongodb';
import { Ticket } from './entities/ticket.entity';

export class TicketRepository extends EntityRepository<Ticket> {}
