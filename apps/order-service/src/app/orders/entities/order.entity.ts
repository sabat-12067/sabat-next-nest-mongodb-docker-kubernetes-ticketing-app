import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Property,
  Enum,
  Index,
  wrap,
  ManyToOne,
  Ref,
  ref,
} from '@mikro-orm/core';
import { BaseEntity } from '../../base.entity';
import { Ticket } from './ticket.entity';
import { OrderRepository } from '../order.repository';

@Entity({ repository: () => OrderRepository, tableName: 'orders' })
export class Order extends BaseEntity {
  [EntityRepositoryType]?: OrderRepository;

  @Property()
  userId: string;

  @Enum(() => OrderStatus)
  @Index()
  status: OrderStatus = OrderStatus.CREATED;

  @Property({ hidden: true })
  expiresAt: Date;

  @ManyToOne(() => Ticket, { ref: true, fieldName: 'ticketId' })
  ticket: Ref<Ticket>;

  constructor(userId: string, status: OrderStatus, ticket: Ticket) {
    super();
    this.userId = userId;
    this.status = status;
    this.ticket = ref(ticket);
  }
}

export enum OrderStatus {
  // When the order has been created, but the
  // ticket it is trying to order has not been reserved
  CREATED = 'created',

  // The ticket the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order.
  // The order expires before payment
  CANCELLED = 'cancelled',

  // The order has successfully reserved the ticket
  AWAITING_PAYMENT = 'awaiting:payment',

  // The order has reserved the ticket and the user has
  // provided payment successfully
  COMPLETE = 'complete',
}
