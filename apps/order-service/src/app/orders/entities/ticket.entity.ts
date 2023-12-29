import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Property,
  wrap,
} from '@mikro-orm/core';
import { BaseEntity } from '../../base.entity';
import { Order } from './order.entity';
import { TicketRepository } from '../ticket.repository';

@Entity({ repository: () => TicketRepository, tableName: 'tickets' })
export class Ticket extends BaseEntity {
  [EntityRepositoryType]?: TicketRepository;

  @Property()
  title: string;

  @Property()
  price: number;

  @OneToMany(() => Order, (order) => order.ticket, { lazy: true })
  orders = new Collection<Order>(this);

  constructor(title: string, price: number) {
    super();
    this.title = title;
    this.price = price;
  }
}
