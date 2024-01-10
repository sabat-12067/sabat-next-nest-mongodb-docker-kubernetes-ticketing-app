import { EntityRepository } from '@mikro-orm/mongodb';
import { Payment } from './entities/payment.entity';

export class PaymentRepository extends EntityRepository<Payment> {}
