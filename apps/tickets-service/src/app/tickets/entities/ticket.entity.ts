import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { TicketRepository } from '../ticket.repository';
import { MongoBaseEntity } from '@ticketing-app/nest-common';

@Entity({ repository: () => TicketRepository, tableName: 'tickets' })
export class Ticket extends MongoBaseEntity {
  [EntityRepositoryType]?: TicketRepository;

  @Property()
  title: string;

  @Property()
  price: number;

  @Property()
  userId: string;

  @Property({ nullable: true })
  orderId?: string;

  constructor({ title, price, userId }: Props) {
    super();
    this.title = title;
    this.price = price;
    this.userId = userId;
  }
}

interface Props {
  title: string;
  price: number;
  userId: string;
}
