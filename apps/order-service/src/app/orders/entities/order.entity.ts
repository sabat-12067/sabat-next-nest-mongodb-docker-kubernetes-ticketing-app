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
import { Ticket } from '../../tickets/entities/ticket.entity';
import { OrderRepository } from '../order.repository';
import { User } from './user.entity';
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
  @Unique()
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
