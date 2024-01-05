import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Order } from './../../orders/entities/order.entity';
import { TicketRepository } from '../ticket.repository';
import { MongoBaseEntity } from '@ticketing-app/nest-common';

@Entity({ repository: () => TicketRepository, tableName: 'tickets' })
export class Ticket extends MongoBaseEntity {
  [EntityRepositoryType]?: TicketRepository;

  @Property()
  title: string;

  @Property()
  price: number;

  @OneToMany(() => Order, (order) => order.ticket, { lazy: true })
  orders = new Collection<Order>(this);

  constructor(props: Props) {
    super();
    this.id = props.id;
    this.title = props.title;
    this.price = props.price;
  }
}

interface Props {
  id?: string;
  title: string;
  price: number;
}
