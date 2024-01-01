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
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../base.entity';
import { Ticket } from './ticket.entity';
import { OrderRepository } from '../order.repository';
import { User } from './user.entity';

@Entity({ repository: () => OrderRepository, tableName: 'orders' })
@Unique({ properties: ['ticket', 'user'] })
export class Order extends BaseEntity {
  [EntityRepositoryType]?: OrderRepository;

  @Enum(() => OrderStatus)
  @Index()
  status: OrderStatus = OrderStatus.CREATED;

  @Property()
  expiresAt: Date;

  @ManyToOne(() => Ticket, { ref: true, fieldName: 'ticketId' })
  ticket: Ref<Ticket>;

  @ManyToOne(() => User, { ref: true, fieldName: 'userId' })
  user: Ref<User>;

  constructor({ user, status, ticket, expiresAt }: Props) {
    super();
    this.user = ref(user);
    this.status = status;
    this.ticket = ref(ticket);
    this.expiresAt = expiresAt;
  }
}

interface Props {
  user: User;
  status: OrderStatus;
  ticket: Ticket;
  expiresAt: Date;
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
