import {
  Entity,
  EntityRepositoryType,
  Property,
  Enum,
  Index,
} from '@mikro-orm/core';
import { OrderRepository } from '../order.repository';
import { MongoBaseEntity, OrderStatus } from '@ticketing-app/nest-common';

@Entity({ repository: () => OrderRepository, tableName: 'orders' })
export class Order extends MongoBaseEntity {
  [EntityRepositoryType]?: OrderRepository;

  @Property()
  @Index()
  userId: string;

  @Property()
  price: number;

  @Enum(() => OrderStatus)
  @Index()
  status: OrderStatus;

  constructor({ userId, status, price, id }: Props) {
    super();
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.price = price;
  }
}

interface Props {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
}
