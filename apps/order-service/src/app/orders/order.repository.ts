import { EntityRepository } from '@mikro-orm/mongodb';
import { Order } from './entities/order.entity';

export class OrderRepository extends EntityRepository<Order> {}
