import {
  Entity,
  EntityRepositoryType,
  Property,
  Unique,
  Ref,
  ref,
  OneToOne,
} from '@mikro-orm/core';
import { PaymentRepository } from '../payment.repository';
import { MongoBaseEntity } from '@ticketing-app/nest-common';
import { Order } from '../../order/entities/order.entity';

@Entity({ repository: () => PaymentRepository, tableName: 'payments' })
export class Payment extends MongoBaseEntity {
  [EntityRepositoryType]?: PaymentRepository;

  @OneToOne(() => Order, { fieldName: 'orderId' })
  order: Ref<Order>;

  @Property()
  @Unique()
  transactionId: string;

  constructor({ order, transactionId }: Props) {
    super();
    this.order = ref(order);
    this.transactionId = transactionId;
  }
}

interface Props {
  order: Order;
  transactionId: string;
}
