import { Injectable, Logger } from '@nestjs/common';
import { UpdateOrderServiceDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { EntityManager, wrap } from '@mikro-orm/core';
import { Order } from './entities/order.entity';
import { RpcException } from '@nestjs/microservices';
import { OrderCreatedEventDto } from '@ticketing-app/nest-common';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly em: EntityManager
  ) {}

  async create(createOrderDto: OrderCreatedEventDto) {
    const { ticket, status, userId, id } = createOrderDto;
    const existingOrder = await this.orderRepository.findOne({ id });
    if (existingOrder) {
      this.logger.warn(`Order ${id} already exists`);
      return existingOrder;
    }
    this.logger.log(createOrderDto, 'createOrderDto');
    const order = new Order({
      id,
      price: ticket.price,
      status,
      userId,
    });

    await this.em.persistAndFlush(order);
    this.logger.log(order, 'New order is created');
    return order;
  }

  findAll() {
    return this.orderRepository.findAll({});
  }

  findOne(id: string) {
    return this.orderRepository.findOne({ id });
  }

  async update(id: string, updateOrderDto: UpdateOrderServiceDto) {
    const order = await this.orderRepository.findOne({ id });
    if (!order) {
      throw new RpcException(`Order ${id} is not found`);
    }
    wrap(order).assign(updateOrderDto);

    await this.em.persistAndFlush(order);
    this.logger.log(order, 'order is updated');
    return order;
  }

  remove(id: string) {
    return this.orderRepository.nativeDelete({ id });
  }
}
