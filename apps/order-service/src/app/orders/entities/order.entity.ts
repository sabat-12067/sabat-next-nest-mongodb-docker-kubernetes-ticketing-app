import {
  Entity,
  EntityRepositoryType,
  Property,
  Enum,
  Index,
  ManyToOne,
  Ref,
  ref,
} from '@mikro-orm/core';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { OrderRepository } from '../order.repository';
import { MongoBaseEntity, OrderStatus } from '@ticketing-app/nest-common';

@Entity({ repository: () => OrderRepository, tableName: 'orders' })
export class Order extends MongoBaseEntity {
  [EntityRepositoryType]?: OrderRepository;

  @Enum(() => OrderStatus)
  @Index()
  status: OrderStatus = OrderStatus.CREATED;

  @Property()
  expiresAt: Date;

  @ManyToOne(() => Ticket, { ref: true, fieldName: 'ticketId' })
  @Index()
  ticket: Ref<Ticket>;

  @Property()
  @Index()
  userId: string;

  constructor({ userId, status, ticket, expiresAt }: Props) {
    super();
    this.userId = userId;
    this.status = status;
    this.ticket = ref(ticket);
    this.expiresAt = expiresAt;
  }
}

interface Props {
  userId: string;
  status: OrderStatus;
  ticket: Ticket;
  expiresAt: Date;
}
