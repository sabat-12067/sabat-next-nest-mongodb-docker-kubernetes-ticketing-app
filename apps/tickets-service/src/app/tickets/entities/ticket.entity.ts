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

  constructor(props: Props) {
    super();

    this.title = props.title;
    this.price = props.price;
    this.userId = props.userId;
  }
}

interface Props {
  id?: string;
  title: string;
  price: number;
  userId: string;
}
