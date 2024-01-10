import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { OrderRepository } from '../order/order.repository';
import { PaymentRepository } from './payment.repository';
import { EntityManager } from '@mikro-orm/core';
import {
  IPaymentCreatedEvent,
  OrderStatus,
  Topics,
  constants,
} from '@ticketing-app/nest-common';
import { Payment } from './entities/payment.entity';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly em: EntityManager,
    @Inject(constants.ORDER_SERVICE)
    private readonly orderClient: ClientRMQ
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    const { transactionId, orderId } = createPaymentDto;
    const order = await this.orderRepository.findOne({
      id: orderId,
    });
    if (!order) {
      throw new NotFoundException();
    }
    if (order.userId !== userId) {
      throw new UnauthorizedException();
    }
    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.EXPIRED
    ) {
      throw new BadRequestException(`Cannot pay for an ${order.status} order`);
    }
    // const charge = await stripe.charges.create({
    //   currency: 'usd',
    //   amount: order.price * 100,
    //   source: token,
    // });

    const payment = new Payment({
      order,
      transactionId: transactionId,
    });

    await this.em.persistAndFlush(payment);
    this.logger.log(payment, 'Payment created');

    // publish payment successful event
    this.orderClient.emit<void, IPaymentCreatedEvent>(Topics.PaymentComplete, {
      orderId: payment.order.id,
    });

    return {
      id: payment.id,
      orderId,
    };
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: string) {
    return this.paymentRepository.findOne({ id });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }
}
